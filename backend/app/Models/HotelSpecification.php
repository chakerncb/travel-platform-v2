<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelSpecification extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'has_wifi',
        'has_parking',
        'has_pool',
        'has_gym',
        'has_spa',
        'has_restaurant',
        'has_bar',
        'has_room_service',
        'has_airport_shuttle',
        'has_pet_friendly',
        'has_air_conditioning',
        'has_laundry',
        'has_conference_room',
        'check_in_time',
        'check_out_time',
        'total_rooms',
    ];

    protected $casts = [
        'has_wifi' => 'boolean',
        'has_parking' => 'boolean',
        'has_pool' => 'boolean',
        'has_gym' => 'boolean',
        'has_spa' => 'boolean',
        'has_restaurant' => 'boolean',
        'has_bar' => 'boolean',
        'has_room_service' => 'boolean',
        'has_airport_shuttle' => 'boolean',
        'has_pet_friendly' => 'boolean',
        'has_air_conditioning' => 'boolean',
        'has_laundry' => 'boolean',
        'has_conference_room' => 'boolean',
        'total_rooms' => 'integer',
    ];

    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }
}
