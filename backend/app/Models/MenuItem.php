<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    //
    protected $fillable = [
        'id',
        'name',
        'description',
        'price',
        'restaurant_id',
        'menu_category_id',
        'created_at',
        'updated_at'
    ];

}
