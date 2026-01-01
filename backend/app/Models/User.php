<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\CustomVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable ,HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'f_name',
        'l_name',
        'phone',
        'address',
        'email',
        'password',
        'is_admin',
        'image_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the restaurant roles for this user.
     */
    public function restaurantRoles()
    {
        return $this->hasMany(RestaurantUsersRole::class, 'user_id');
    }

    /**
     * Check if user has owner role for a specific restaurant.
     */
    public function isOwnerOf($restaurantId)
    {
        return $this->restaurantRoles()
            ->whereHas('restaurantRole', function ($query) {
                $query->where('name', 'Owner');
            })
            ->where('restaurant_id', $restaurantId)
            ->exists();
    }

    /**
     * Check if user has owner role for any restaurant.
     */
    public function isOwner()
    {
        return $this->restaurantRoles()
            ->whereHas('restaurantRole', function ($query) {
                $query->where('name', 'Owner');
            })
            ->exists();
    }

    public function restaurantId()
    {
        // get the first restaurant id where the user has an owner role
        $ownerRole = $this->restaurantRoles()
            ->whereHas('restaurantRole', function ($query) {
                $query->where('name', 'Owner');
            })
            ->first();
            
        return $ownerRole ? $ownerRole->restaurant_id : null;
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);
    }
}
