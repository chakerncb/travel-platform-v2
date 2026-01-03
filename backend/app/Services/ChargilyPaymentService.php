<?php

namespace App\Services;

use Chargily\ChargilyPay\ChargilyPay;
use Chargily\ChargilyPay\Auth\Credentials;
use Illuminate\Support\Facades\Log;

class ChargilyPaymentService
{
    protected ChargilyPay $chargily;

    public function __construct()
    {
        $this->chargily = new ChargilyPay(
            new Credentials([
                'public' => config('services.chargily.api_key'),
                'secret' => config('services.chargily.api_secret'),
                'mode' => config('services.chargily.mode', 'test'),
            ])
        );
    }

    /**
     * Create a payment checkout for a booking
     */
    public function createCheckout(
        string $bookingReference,
        float $amount,
        string $customerEmail,
        string $customerName,
        array $metadata = []
    ): array {
        try {
            $checkout = $this->chargily->checkouts()->create([
                'amount' => $amount * 100, // Convert to cents
                'currency' => 'dzd',
                'success_url' => config('app.frontend_url') . '/booking/payment/success?reference=' . $bookingReference,
                'failure_url' => config('app.frontend_url') . '/booking/payment/failure?reference=' . $bookingReference,
                'webhook_endpoint' => config('app.url') . '/api/webhooks/chargily',
                'description' => 'Booking Payment - ' . $bookingReference,
                'locale' => 'en',
                'metadata' => array_merge([
                    'booking_reference' => $bookingReference,
                    'customer_email' => $customerEmail,
                    'customer_name' => $customerName,
                ], $metadata),
            ]);

            return [
                'success' => true,
                'checkout_id' => $checkout->toArray()['id'],
                'checkout_url' => $checkout->toArray()['url'],
            ];
        } catch (\Exception $e) {
            Log::error('Chargily checkout creation failed', [
                'error' => $e->getMessage(),
                'booking_reference' => $bookingReference,
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get checkout details
     */
    public function getCheckout(string $checkoutId): ?object
    {
        try {
            return $this->chargily->checkouts()->get($checkoutId);
        } catch (\Exception $e) {
            Log::error('Failed to fetch Chargily checkout', [
                'error' => $e->getMessage(),
                'checkout_id' => $checkoutId,
            ]);
            return null;
        }
    }

    /**
     * Verify webhook signature
     */
    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        try {
            $secret = config('services.chargily.api_secret');
            $computedSignature = hash_hmac('sha256', $payload, $secret);
            return hash_equals($computedSignature, $signature);
        } catch (\Exception $e) {
            Log::error('Webhook signature verification failed', [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}
