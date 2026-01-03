<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'user_id',
        'booking_reference',
        'start_date',
        'end_date',
        'adults_count',
        'children_count',
        'total_price',
        'contact_first_name',
        'contact_last_name',
        'contact_email',
        'contact_phone',
        'contact_date_of_birth',
        'contact_passport_number',
        'contact_nationality',
        'passengers',
        'special_requests',
        'status',
        'payment_status',
        'amount_paid',
        'payment_method',
        'payment_transaction_id',
        'payment_checkout_url',
        'payment_date',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'adults_count' => 'integer',
        'children_count' => 'integer',
        'total_price' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'passengers' => 'array',
        'contact_date_of_birth' => 'date',
        'payment_date' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (!$booking->booking_reference) {
                $booking->booking_reference = self::generateBookingReference();
            }
        });
    }

    /**
     * Generate a unique booking reference
     */
    public static function generateBookingReference(): string
    {
        do {
            $reference = 'BK-' . strtoupper(Str::random(8));
        } while (self::where('booking_reference', $reference)->exists());

        return $reference;
    }

    /**
     * Get the tour that owns the booking.
     */
    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    /**
     * Get the user that made the booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get total number of passengers
     */
    public function getTotalPassengersAttribute(): int
    {
        return $this->adults_count + $this->children_count;
    }

    /**
     * Check if booking is confirmed
     */
    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    /**
     * Check if booking is cancelled
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Check if payment is completed
     */
    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Cancel the booking
     */
    public function cancel(string $reason = null): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }

    /**
     * Confirm the booking
     */
    public function confirm(): void
    {
        $this->update(['status' => 'confirmed']);
    }

    /**
     * Mark payment as completed
     */
    public function markAsPaid(float $amount, string $method = null, string $transactionId = null): void
    {
        $this->update([
            'payment_status' => 'paid',
            'amount_paid' => $amount,
            'payment_method' => $method,
            'payment_transaction_id' => $transactionId,
            'payment_date' => now(),
        ]);
    }
}
