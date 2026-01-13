<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomTourBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_reference',
        'user_email',
        'user_name',
        'start_date',
        'end_date',
        'number_of_persons',
        'proposed_price',
        'minimum_price',
        'estimated_hotel_cost',
        'admin_price',
        'final_price',
        'notes',
        'admin_notes',
        'status',
        'admin_recommended_destinations',
        'admin_recommended_hotels',
        'payment_status',
        'payment_method',
        'payment_url',
        'paid_at',
        'admin_reviewed_at',
        'user_confirmed_at',
    ];

    protected $casts = [
        'admin_recommended_destinations' => 'json',
        'admin_recommended_hotels' => 'json',
        'proposed_price' => 'decimal:2',
        'minimum_price' => 'decimal:2',
        'estimated_hotel_cost' => 'decimal:2',
        'admin_price' => 'decimal:2',
        'final_price' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'paid_at' => 'datetime',
        'admin_reviewed_at' => 'datetime',
        'user_confirmed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->booking_reference)) {
                $booking->booking_reference = 'CTB-' . strtoupper(uniqid());
            }
        });
    }

    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'pending' => 'Pending Review',
            'under_review' => 'Under Review',
            'admin_proposed' => 'Admin Proposal Sent',
            'user_confirmed' => 'User Confirmed',
            'rejected' => 'Rejected',
            'paid' => 'Paid',
            'completed' => 'Completed',
            default => ucfirst($this->status),
        };
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isAdminProposed()
    {
        return $this->status === 'admin_proposed';
    }

    public function isUserConfirmed()
    {
        return $this->status === 'user_confirmed';
    }

    public function isPaid()
    {
        return $this->payment_status === 'paid';
    }


    public function destinations(): BelongsToMany
    {
        return $this->belongsToMany(Destination::class, 'custom_tour_booking_destination');
    }

    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(Hotel::class, 'custom_tour_booking_hotel');
    }

    public function flights(): HasMany
    {
        return $this->hasMany(TourFlight::class, 'custom_tour_booking_id');
    }

}
