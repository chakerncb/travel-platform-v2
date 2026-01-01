<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItemImage extends Model
{
    //
    protected $fillable = [
        'id',
        'menu_item_id',
        'image_path',
        'created_at',
        'updated_at'
    ];

    protected $table = 'menu_item_images';
}
