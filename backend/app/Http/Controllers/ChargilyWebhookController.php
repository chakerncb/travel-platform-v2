<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Services\ChargilyPaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ChargilyWebhookController extends Controller
{
    /**
     * Handle Chargily webhook events
     */
    public function handle(Request $request, ChargilyPaymentService $chargilyService): JsonResponse
    {
        // Verify webhook signature
        $signature = $request->header('Signature');
        $payload = $request->getContent();

        if (!$chargilyService->verifyWebhookSignature($payload, $signature)) {
            Log::warning('Invalid Chargily webhook signature');
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $event = $request->all();
        $eventType = $event['type'] ?? null;

        Log::info('Chargily webhook received', [
            'type' => $eventType,
            'data' => $event
        ]);

        try {
            switch ($eventType) {
                case 'checkout.paid':
                    $this->handleCheckoutPaid($event);
                    break;

                case 'checkout.failed':
                    $this->handleCheckoutFailed($event);
                    break;

                default:
                    Log::info('Unhandled Chargily webhook event type: ' . $eventType);
            }

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            Log::error('Chargily webhook processing failed', [
                'error' => $e->getMessage(),
                'event' => $event
            ]);

            return response()->json(['error' => 'Processing failed'], 500);
        }
    }

    /**
     * Handle successful payment
     */
    protected function handleCheckoutPaid(array $event): void
    {
        $checkoutData = $event['data'] ?? [];
        $metadata = $checkoutData['metadata'] ?? [];
        $bookingReference = $metadata['booking_reference'] ?? null;

        if (!$bookingReference) {
            Log::error('Booking reference not found in Chargily webhook metadata');
            return;
        }

        $booking = Booking::where('booking_reference', $bookingReference)->first();

        if (!$booking) {
            Log::error('Booking not found for reference: ' . $bookingReference);
            return;
        }

        // Update booking payment status
        $booking->markAsPaid(
            amount: ($checkoutData['amount'] ?? 0) / 100, // Convert from cents
            method: 'chargily',
            transactionId: $checkoutData['id'] ?? null
        );

        Log::info('Booking payment completed', [
            'booking_id' => $booking->id,
            'booking_reference' => $booking->booking_reference,
            'amount' => $booking->amount_paid
        ]);

        // TODO: Send payment confirmation email to customer
    }

    /**
     * Handle failed payment
     */
    protected function handleCheckoutFailed(array $event): void
    {
        $checkoutData = $event['data'] ?? [];
        $metadata = $checkoutData['metadata'] ?? [];
        $bookingReference = $metadata['booking_reference'] ?? null;

        if (!$bookingReference) {
            return;
        }

        $booking = Booking::where('booking_reference', $bookingReference)->first();

        if (!$booking) {
            return;
        }

        $booking->update([
            'payment_status' => 'failed'
        ]);

        Log::info('Booking payment failed', [
            'booking_id' => $booking->id,
            'booking_reference' => $booking->booking_reference
        ]);

        // TODO: Send payment failed email to customer
    }
}
