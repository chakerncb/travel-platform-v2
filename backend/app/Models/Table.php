<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    //
    protected $fillable = [
        'id',
        'restaurant_id',
        'table_number',
        'qrcode',
        'created_at',
        'updated_at'
    ];
}
