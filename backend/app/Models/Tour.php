<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'description',
        'short_description',
        'price',
        'duration_days',
        'max_group_size',
        'difficulty_level',
        'start_date',
        'end_date',
        'is_active',
        'is_eco_friendly',
        'included_services',
        'excluded_services',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration_days' => 'integer',
        'max_group_size' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'is_eco_friendly' => 'boolean',
        'included_services' => 'array',
        'excluded_services' => 'array',
    ];

    public function destinations(): BelongsToMany
    {
        return $this->belongsToMany(Destination::class, 'tour_destinations')
            ->withPivot('order', 'days_at_destination')
            ->withTimestamps()
            ->orderBy('order');
    }

    public function tourDestinations(): HasMany
    {
        return $this->hasMany(TourDestination::class)->orderBy('order');
    }

    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(Hotel::class, 'tour_hotels')
            ->withPivot('nights', 'order')
            ->withTimestamps()
            ->orderBy('order');
    }

    public function tourHotels(): HasMany
    {
        return $this->hasMany(TourHotel::class)->orderBy('order');
    }

    public function commenters(): HasMany
    {
        return $this->hasMany(Commenter::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get confirmed bookings only
     */
    public function confirmedBookings(): HasMany
    {
        return $this->hasMany(Booking::class)->whereIn('status', ['confirmed', 'completed']);
    }

    /**
     * Get the total number of booked places
     */
    public function getBookedPlacesAttribute(): int
    {
        return $this->confirmedBookings()
            ->selectRaw('SUM(adults_count + children_count) as total')
            ->value('total') ?? 0;
    }

    /**
     * Get the number of remaining places
     */
    public function getRemainingPlacesAttribute(): int
    {
        return max(0, $this->max_group_size - $this->booked_places);
    }

    /**
     * Check if tour is fully booked
     */
    public function isFullyBooked(): bool
    {
        return $this->remaining_places <= 0;
    }

    /**
     * Check if there are enough places for a booking
     */
    public function hasAvailablePlaces(int $requiredPlaces): bool
    {
        return $this->remaining_places >= $requiredPlaces;
    }
}
