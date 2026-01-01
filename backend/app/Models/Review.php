<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'commenter_id',
        'rating',
        'comment',
        'is_verified',
        'is_approved',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function commenter(): BelongsTo
    {
        return $this->belongsTo(Commenter::class);
    }
}
