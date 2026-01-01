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
}
