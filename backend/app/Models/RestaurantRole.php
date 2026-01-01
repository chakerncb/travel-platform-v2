<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantRole extends Model
{
    //
    protected $fillable = [
        'id',
        'name',
        'description',
        'created_at',
        'updated_at',
    ];
}
