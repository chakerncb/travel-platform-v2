<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    //
    protected $fillable = [
        'id',
        'name',
        'address',
        'phone',
        'email',
        'description',
        'logo_path',
        'is_active',
        'created_at',
        'updated_at',
    ];

    public function staff(){
        return $this->belongsToMany(User::class, 'restaurant_users_roles', 'restaurant_id', 'user_id')
                    ->withPivot('restaurant_role_id')
                    ->withTimestamps();
    } 

    public function orders()
    {
        return $this->hasMany('App\Models\Order');
    }

    public function images()
    {
        return $this->hasMany('App\Models\RestaurantImage');
    }

    public function menuItems()
    {
        return $this->hasMany('App\Models\MenuItem');
    }
}
