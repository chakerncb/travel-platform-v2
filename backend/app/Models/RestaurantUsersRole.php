<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantUsersRole extends Model
{
    protected $table = 'restaurant_users_roles';
    
    protected $fillable = [
        'id',
        'user_id',
        'restaurant_id',
        'restaurant_role_id',
        'created_at',
        'updated_at',
    ];
    
    /**
     * Get the user that owns this role assignment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the restaurant this role assignment belongs to.
     */
    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    /**
     * Get the restaurant role.
     */
    public function restaurantRole()
    {
        return $this->belongsTo(RestaurantRole::class);
    }
}
