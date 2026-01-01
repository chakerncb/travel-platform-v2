<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'description',
        'short_description',
        'city',
        'country',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(DestinationImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(DestinationImage::class)->where('is_primary', true);
    }

    public function tours(): BelongsToMany
    {
        return $this->belongsToMany(Tour::class, 'tour_destinations')
            ->withPivot('order', 'days_at_destination')
            ->withTimestamps()
            ->orderBy('order');
    }
}
