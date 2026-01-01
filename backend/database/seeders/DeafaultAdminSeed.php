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
        User::firstOrCreate(
            ['email' => 'admin@ecotravel.com'],
            [
                'f_name' => 'Admin',
                'l_name' => 'CHaker',
                'email' => 'chaker@ecotravel.com',
                'password' => Hash::make('Chaker111$$'),
                'phone' => '1234567890',
                'address' => 'Admin Address',
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
