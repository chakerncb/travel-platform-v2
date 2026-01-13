<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomTourBooking;
use App\Mail\CustomTourRequestReceived;
use App\Mail\CustomTourAdminProposal;
use App\Mail\CustomTourUserConfirmed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class CustomTourBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CustomTourBooking::query();

        // Filter by user email if provided
        if ($request->has('user_email')) {
            $query->where('user_email', $request->user_email);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($bookings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_email' => 'required|email',
            'user_name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'destinations' => 'required|array|min:1',
            'destinations.*.id' => 'required|exists:destinations,id',
            'hotels' => 'nullable|array',
            'hotels.*.id' => 'required|exists:hotels,id',
            'flights' => 'nullable|array',
            'number_of_persons' => 'required|integer|min:1',
            'proposed_price' => 'required|numeric|min:0',
            'minimum_price' => 'required|numeric|min:0',
            'estimated_hotel_cost' => 'nullable|numeric|min:0',
            'total_flight_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validate that proposed price >= minimum price
        if ($request->proposed_price < $request->minimum_price) {
            return response()->json([
                'error' => 'Proposed price must be at least the minimum price'
            ], 422);
        }

        $booking = CustomTourBooking::create([
            'user_email' => $request->user_email,
            'user_name' => $request->user_name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'number_of_persons' => $request->number_of_persons,
            'proposed_price' => $request->proposed_price,
            'minimum_price' => $request->minimum_price,
            'estimated_hotel_cost' => $request->estimated_hotel_cost ?? 0,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);
        
        // Attach destinations
        if ($request->has('destinations') && is_array($request->destinations)) {
            $destinationIds = array_column($request->destinations, 'id');
            $booking->destinations()->attach($destinationIds);
        }
        
        // Attach hotels
        if ($request->has('hotels') && is_array($request->hotels)) {
            $hotelIds = array_column($request->hotels, 'id');
            $booking->hotels()->attach($hotelIds);
        }

        // Save flight bookings if provided
        if ($request->has('flights') && is_array($request->flights)) {
            foreach ($request->flights as $flightData) {
                $booking->flights()->create([
                    'segment_index' => $flightData['segment_index'],
                    'flight_offer_id' => $flightData['flight_offer_id'],
                    'origin_airport_code' => $flightData['origin_airport_code'],
                    'origin_airport_name' => $flightData['origin_airport_name'],
                    'origin_city' => $flightData['origin_city'],
                    'origin_country' => $flightData['origin_country'] ?? null,
                    'origin_latitude' => $flightData['origin_latitude'] ?? null,
                    'origin_longitude' => $flightData['origin_longitude'] ?? null,
                    'destination_airport_code' => $flightData['destination_airport_code'],
                    'destination_airport_name' => $flightData['destination_airport_name'],
                    'destination_city' => $flightData['destination_city'],
                    'destination_country' => $flightData['destination_country'] ?? null,
                    'destination_latitude' => $flightData['destination_latitude'] ?? null,
                    'destination_longitude' => $flightData['destination_longitude'] ?? null,
                    'departure_datetime' => $flightData['departure_datetime'],
                    'arrival_datetime' => $flightData['arrival_datetime'],
                    'duration' => $flightData['duration'] ?? null,
                    'number_of_stops' => $flightData['number_of_stops'] ?? 0,
                    'airline_code' => $flightData['airline_code'] ?? null,
                    'airline_name' => $flightData['airline_name'] ?? null,
                    'aircraft_code' => $flightData['aircraft_code'] ?? null,
                    'flight_number' => $flightData['flight_number'] ?? null,
                    'price_amount' => $flightData['price_amount'],
                    'price_currency' => $flightData['price_currency'] ?? 'DZD',
                    'itineraries' => $flightData['itineraries'] ?? null,
                    'traveler_pricings' => $flightData['traveler_pricings'] ?? null,
                    'fare_details' => $flightData['fare_details'] ?? null,
                ]);
            }
        }

        // Send email notifications
        try {
            // Email to user
            Mail::to($request->user_email)->send(new CustomTourRequestReceived($booking));
            
            // Email to admin (you can configure admin email in .env)
            $adminEmail = config('mail.admin_email', 'admin@example.com');
            Mail::to($adminEmail)->send(new CustomTourRequestReceived($booking));
        } catch (\Exception $e) {
            \Log::error('Failed to send custom tour booking emails: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Custom tour request submitted successfully',
            'booking' => $booking
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $booking = CustomTourBooking::with(['destinations', 'hotels', 'flights'])->findOrFail($id);
        return response()->json($booking);
    }

    /**
     * Admin proposes price and recommendations
     */
    public function adminProposal(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'admin_price' => 'required|numeric|min:0',
            'admin_notes' => 'nullable|string',
            'admin_recommended_destinations' => 'nullable|array',
            'admin_recommended_hotels' => 'nullable|array',
            'payment_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $booking = CustomTourBooking::findOrFail($id);

        $booking->update([
            'admin_price' => $request->admin_price,
            'final_price' => $request->admin_price,
            'admin_notes' => $request->admin_notes,
            'admin_recommended_destinations' => $request->admin_recommended_destinations,
            'admin_recommended_hotels' => $request->admin_recommended_hotels,
            'payment_url' => $request->payment_url,
            'status' => 'admin_proposed',
            'admin_reviewed_at' => now(),
        ]);

        // Send email to user about admin proposal with payment link
        try {
            Mail::to($booking->user_email)->send(new CustomTourAdminProposal($booking));
        } catch (\Exception $e) {
            \Log::error('Failed to send admin proposal email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Proposal sent to user successfully',
            'booking' => $booking
        ]);
    }

    /**
     * User confirms admin proposal
     */
    public function userConfirm(Request $request, string $id)
    {
        $booking = CustomTourBooking::findOrFail($id);

        if ($booking->status !== 'admin_proposed') {
            return response()->json([
                'error' => 'Booking is not in a state that can be confirmed'
            ], 422);
        }

        $booking->update([
            'status' => 'user_confirmed',
            'user_confirmed_at' => now(),
        ]);

        // Send confirmation email
        try {
            Mail::to($booking->user_email)->send(new CustomTourUserConfirmed($booking));
            
            $adminEmail = config('mail.admin_email', 'admin@example.com');
            Mail::to($adminEmail)->send(new CustomTourUserConfirmed($booking));
        } catch (\Exception $e) {
            \Log::error('Failed to send confirmation email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Booking confirmed successfully. Please proceed to payment.',
            'booking' => $booking
        ]);
    }

    /**
     * Update payment status
     */
    public function updatePayment(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'payment_status' => 'required|in:paid,failed',
            'payment_method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $booking = CustomTourBooking::findOrFail($id);

        $booking->update([
            'payment_status' => $request->payment_status,
            'payment_method' => $request->payment_method,
            'paid_at' => $request->payment_status === 'paid' ? now() : null,
            'status' => $request->payment_status === 'paid' ? 'paid' : $booking->status,
        ]);

        return response()->json([
            'message' => 'Payment status updated successfully',
            'booking' => $booking
        ]);
    }

    /**
     * Reject booking
     */
    public function reject(Request $request, string $id)
    {
        $booking = CustomTourBooking::findOrFail($id);

        $booking->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes ?? $booking->admin_notes,
        ]);

        return response()->json([
            'message' => 'Booking rejected',
            'booking' => $booking
        ]);
    }
}
