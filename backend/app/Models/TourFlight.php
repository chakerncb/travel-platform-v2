<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourFlight extends Model
{
    use HasFactory;

    protected $fillable = [
        'custom_tour_booking_id',
        'segment_index',
        'flight_offer_id',
        'origin_airport_code',
        'origin_airport_name',
        'origin_city',
        'origin_country',
        'origin_latitude',
        'origin_longitude',
        'destination_airport_code',
        'destination_airport_name',
        'destination_city',
        'destination_country',
        'destination_latitude',
        'destination_longitude',
        'departure_datetime',
        'arrival_datetime',
        'duration',
        'number_of_stops',
        'airline_code',
        'airline_name',
        'aircraft_code',
        'flight_number',
        'price_amount',
        'price_currency',
        'itineraries',
        'traveler_pricings',
        'fare_details',
    ];

    protected $casts = [
        'departure_datetime' => 'datetime',
        'arrival_datetime' => 'datetime',
        'origin_latitude' => 'decimal:7',
        'origin_longitude' => 'decimal:7',
        'destination_latitude' => 'decimal:7',
        'destination_longitude' => 'decimal:7',
        'price_amount' => 'decimal:2',
        'number_of_stops' => 'integer',
        'segment_index' => 'integer',
        'itineraries' => 'array',
        'traveler_pricings' => 'array',
        'fare_details' => 'array',
    ];

    /**
     * Get the custom tour booking that owns this flight
     */
    public function customTourBooking(): BelongsTo
    {
        return $this->belongsTo(CustomTourBooking::class);
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute(): string
    {
        return $this->price_currency . ' ' . number_format($this->price_amount, 2);
    }

    /**
     * Get route description
     */
    public function getRouteDescriptionAttribute(): string
    {
        return "{$this->origin_city} ({$this->origin_airport_code}) → {$this->destination_city} ({$this->destination_airport_code})";
    }
}
