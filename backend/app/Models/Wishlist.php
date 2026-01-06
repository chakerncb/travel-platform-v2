<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Wishlist extends Model
{
    protected $fillable = [
        'user_id',
        'wishlistable_type',
        'wishlistable_id',
    ];

    /**
     * Get the user that owns the wishlist item.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the wishlistable model (Tour, Destination, or Hotel).
     */
    public function wishlistable(): MorphTo
    {
        return $this->morphTo();
    }
}
