<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourHotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'hotel_id',
        'nights',
        'order',
    ];

    protected $casts = [
        'nights' => 'integer',
        'order' => 'integer',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }
}
