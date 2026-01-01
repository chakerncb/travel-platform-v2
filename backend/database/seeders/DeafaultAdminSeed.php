<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DeafaultAdminSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::create([
            'f_name' => 'chaker',
            'l_name' => 'necibi',
            'email' => 'chaker@gmail.com',
            'password' => Hash::make('Chaker111$$'),
            'phone' => '1234567890',
            'address' => '123 Main St, City, Country',
            'is_admin' => true, // Set to true for admin user
        ]);
    }
}
