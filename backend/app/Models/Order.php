<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //

    protected $fillable = [
        'restaurant_id',
        'table_id',
        'user_id',
        'total_amount',
        'status',
        'invoice_path',
    ];

    public $timestamps = true;

    public function items(){
        return $this->hasMany('App\Models\OrderItem');
    }


}
