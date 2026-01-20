<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Mail\BookingCreated;
use App\Mail\BookingConfirmed;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\User;
use App\Services\ChargilyPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Booking::with(['tour', 'user']);

        // Filter by user if authenticated
        if ($request->user()) {
            $query->where('user_id', $request->user()->id);
        }

        // Filter by email for guest bookings
        if ($request->has('email')) {
            $query->where('contact_email', $request->email);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by booking reference
        if ($request->has('booking_reference')) {
            $query->where('booking_reference', $request->booking_reference);
        }

        $bookings = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => BookingResource::collection($bookings)
        ]);
    }

    /**
     * Store a newly created booking.
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();

            // Get the tour and verify availability
            $tour = Tour::findOrFail($validated['tour_id']);
            $totalPassengers = $validated['adults_count'] + $validated['children_count'];

            if (!$tour->hasAvailablePlaces($totalPassengers)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough available places for this tour. Only ' . $tour->remaining_places . ' places remaining.'
                ], 422);
            }

            // Check if tour is active
            if (!$tour->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'This tour is not currently available for booking.'
                ], 422);
            }

            if($request->use_points){
                $user = User::find(Auth::id());
                if($user && $user->eco_points >= $request->points_to_use){
                    $discount_percentage = ($request->points_to_use / 100) * 10; // 10% per 100 points
                    $discount_amount = ($discount_percentage / 100) * $validated['total_price'];
                    $validated['total_price'] -= $discount_amount;
                }

            }


          

            // Create booking
            $booking = Booking::create([
                'tour_id' => $validated['tour_id'],
                'user_id' => Auth::id(),
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'adults_count' => $validated['adults_count'],
                'children_count' => $validated['children_count'],
                'total_price' => $validated['total_price'],
                'discount_applied' => $request->use_points ? ($discount_amount ?? 0) : 0,
                'contact_first_name' => $validated['main_contact']['firstName'],
                'contact_last_name' => $validated['main_contact']['lastName'],
                'contact_email' => $validated['main_contact']['email'],
                'contact_phone' => $validated['main_contact']['phone'],
                'contact_date_of_birth' => $validated['main_contact']['dateOfBirth'] ?? null,
                'contact_passport_number' => $validated['main_contact']['passportNumber'] ?? null,
                'contact_nationality' => $validated['main_contact']['nationality'] ?? null,
                'passengers' => $validated['passengers'] ?? [],
                'special_requests' => $validated['special_requests'] ?? null,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

              if ($tour->is_eco_friendly) {
               $ecoPoints = 10 * $totalPassengers;
               $user = User::find(Auth::id());
               if ($user) {
                   $user->increment('eco_points', $ecoPoints);
               }

            }

            DB::commit();

            // Send booking created email
            try {
                Mail::to($booking->contact_email)->send(new BookingCreated($booking));
            } catch (\Exception $e) {
                Log::error('Failed to send booking created email: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully. Please check your email for confirmation.',
                'data' => [
                    'booking_id' => $booking->id,
                    'booking_reference' => $booking->booking_reference,
                    'booking' => new BookingResource($booking->load('tour'))
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Booking creation failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified booking.
     */
    public function show(string $id): JsonResponse
    {
        $booking = Booking::with(['tour', 'user'])->findOrFail($id);

        // Check authorization
        if (Auth::check() && $booking->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this booking.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    /**
     * Get booking by reference number.
     */
    public function getByReference(string $reference): JsonResponse
    {
        $booking = Booking::with(['tour', 'user'])
            ->where('booking_reference', $reference)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    /**
     * Update the specified booking.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);

        // Check authorization
        if (Auth::check() && $booking->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this booking.'
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'special_requests' => 'sometimes|nullable|string|max:1000',
        ]);

        $booking->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Booking updated successfully',
            'data' => new BookingResource($booking->fresh())
        ]);
    }

    /**
     * Cancel a booking.
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);

        // Check authorization
        if (Auth::check() && $booking->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to cancel this booking.'
            ], 403);
        }

        if ($booking->isCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Booking is already cancelled.'
            ], 422);
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        $booking->cancel($validated['reason'] ?? null);

        return response()->json([
            'success' => true,
            'message' => 'Booking cancelled successfully',
            'data' => new BookingResource($booking->fresh())
        ]);
    }

    /**
     * Confirm a booking (admin only) and send payment link.
     */
    public function confirm(string $id, ChargilyPaymentService $chargilyService): JsonResponse
    {
        $booking = Booking::findOrFail($id);

        if ($booking->isConfirmed()) {
            return response()->json([
                'success' => false,
                'message' => 'Booking is already confirmed.'
            ], 422);
        }

        try {
            // Confirm the booking
            $booking->confirm();

            // Create Chargily payment checkout
            $paymentResult = $chargilyService->createCheckout(
                bookingReference: $booking->booking_reference,
                amount: floatval($booking->total_price),
                customerEmail: $booking->contact_email,
                customerName: $booking->contact_first_name . ' ' . $booking->contact_last_name,
                metadata: [
                    'booking_id' => $booking->id,
                    'tour_id' => $booking->tour_id,
                    'tour_name' => $booking->tour->title,
                ]
            );

            if (!$paymentResult['success']) {
                Log::error('Failed to create Chargily checkout', [
                    'booking_id' => $booking->id,
                    'error' => $paymentResult['error'] ?? 'Unknown error'
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Booking confirmed but failed to create payment link. Please contact support.'
                ], 500);
            }

            // Store checkout ID in booking
            $booking->update([
                'payment_transaction_id' => $paymentResult['checkout_id']
            ]);

            // Send confirmation email with payment link
            try {
                Mail::to($booking->contact_email)->send(
                    new BookingConfirmed($booking, $paymentResult['checkout_url'])
                );
            } catch (\Exception $e) {
                Log::error('Failed to send booking confirmed email: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Booking confirmed successfully. Payment link sent to customer.',
                'data' => [
                    'booking' => new BookingResource($booking->fresh()),
                    'payment_url' => $paymentResult['checkout_url']
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Booking confirmation failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to confirm booking.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get tour availability.
     */
    public function getTourAvailability(int $tourId): JsonResponse
    {
        $tour = Tour::findOrFail($tourId);

        return response()->json([
            'success' => true,
            'data' => [
                'tour_id' => $tour->id,
                'max_group_size' => $tour->max_group_size,
                'booked_places' => $tour->booked_places,
                'remaining_places' => $tour->remaining_places,
                'is_fully_booked' => $tour->isFullyBooked(),
            ]
        ]);
    }

    /**
     * Check if user has already booked this tour.
     */
    public function checkUserBooking(Request $request, int $tourId): JsonResponse
    {
        $email = $request->input('email');
        $userId = Auth::id();

        $hasBooking = Booking::where('tour_id', $tourId)
            ->where(function($query) use ($email, $userId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                }
                if ($email) {
                    $query->orWhere('contact_email', $email);
                }
            })
            ->whereIn('status', ['pending', 'confirmed', 'completed'])
            ->exists();

        return response()->json([
            'success' => true,
            'data' => [
                'has_booking' => $hasBooking
            ]
        ]);
    }

    /**
     * Verify payment status after redirect from payment gateway
     */
    public function verifyPayment(Request $request): JsonResponse
    {
        try {
            $reference = $request->query('reference');
            $checkoutId = $request->query('checkout_id');

            if (!$reference) {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing booking reference'
                ], 400);
            }

            // Find booking by reference
            $booking = Booking::with('tour')
                ->where('booking_reference', $reference)
                ->first();

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found'
                ], 404);
            }

            // // If checkout_id is provided, verify with Chargily
            // if ($checkoutId && $booking->chargily_checkout_id === $checkoutId) {
            //     // If user reached success page with valid checkout_id, mark payment as completed
                if ($booking->payment_status === 'pending') {
                    $booking->update([
                        'payment_status' => 'paid',
                        'payment_date' => now(),
                        'amount_paid' => $booking->total_price,
                        'payment_transaction_id' => $checkoutId,
                    ]);
                    
                    Log::info('Payment marked as completed', [
                        'reference' => $reference,
                        'checkout_id' => $checkoutId,
                        'new_payment_status' => 'paid',
                        'new_booking_status' => 'confirmed'
                    ]);
                }
            // }

            // Return booking details
            return response()->json([
                'success' => true,
                'data' => [
                    'booking_reference' => $booking->booking_reference,
                    'status' => $booking->status,
                    'payment_status' => $booking->payment_status,
                    'tour_title' => $booking->tour->title ?? null,
                    'total_amount' => $booking->total_price,
                    'customer_email' => $booking->contact_email,
                    'checkout_id' => $booking->chargily_checkout_id,
                ],
                'message' => 'Payment verified successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Payment verification error', [
                'error' => $e->getMessage(),
                'reference' => $request->query('reference')
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to verify payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified booking.
     */
    public function destroy(string $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);

        // Check authorization (admin only typically)
        if (Auth::check() && $booking->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this booking.'
            ], 403);
        }

        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'Booking deleted successfully'
        ]);
    }
}
