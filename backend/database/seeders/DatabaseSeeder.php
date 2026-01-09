<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // $this->call(DeafaultAdminSeed::class);
        $this->call(AlgeriaDestinationsSeeder::class);
        $this->call(AlgeriaHotelsSeeder::class);
        $this->call(UpdateDestinationCoordinatesSeeder::class);
        $this->call(HotelDetailsSeeder::class);
        $this->call(DestinationImagesSeeder::class);
        $this->call(HotelImagesSeeder::class);
        $this->call(AlgeriaToursSeeder::class);
    }
}
