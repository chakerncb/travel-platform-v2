<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'city',
        'country',
        'latitude',
        'longitude',
        'address',
        'phone',
        'email',
        'website',
        'star_rating',
        'price_per_night',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'star_rating' => 'integer',
        'price_per_night' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(HotelImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(HotelImage::class)->where('is_primary', true);
    }

    public function specifications(): HasOne
    {
        return $this->hasOne(HotelSpecification::class);
    }

    public function tours(): BelongsToMany
    {
        return $this->belongsToMany(Tour::class, 'tour_hotels')
            ->withPivot('nights', 'order')
            ->withTimestamps();
    }
}
