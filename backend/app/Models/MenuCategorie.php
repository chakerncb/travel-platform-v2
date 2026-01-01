<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuCategorie extends Model
{
    //
    protected $table = "menu_categories";
    protected $fillable = [
        'id',
        'restaurant_id',
        'name',
        'slug',
        'active',
        'created_at',
        'updated_at',
    ];

    public function menu_items()
    {
        return $this->hasMany('App\Models\MenuItem', 'menu_category_id');
    }
}
