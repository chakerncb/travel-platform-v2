<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourDestination extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'destination_id',
        'order',
        'days_at_destination',
    ];

    protected $casts = [
        'order' => 'integer',
        'days_at_destination' => 'integer',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }
}
