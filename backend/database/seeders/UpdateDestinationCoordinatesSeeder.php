<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Destination;

class UpdateDestinationCoordinatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coordinates = [
            'Bejaia Corniche' => ['latitude' => 36.7525, 'longitude' => 5.0569],
            'Gouraya National Park' => ['latitude' => 36.7800, 'longitude' => 5.0900],
            'Beni Hammad Fort' => ['latitude' => 35.8167, 'longitude' => 4.7833],
            'Timimoun Ksar' => ['latitude' => 29.2633, 'longitude' => 0.2414],
            'Algiers Casbah' => ['latitude' => 36.7833, 'longitude' => 3.0594],
            'Tipaza Roman Ruins' => ['latitude' => 36.5897, 'longitude' => 2.4458],
            'Tassili n\'Ajjer' => ['latitude' => 25.5000, 'longitude' => 9.0000],
            'Hoggar Mountains' => ['latitude' => 23.2667, 'longitude' => 5.6000],
            'Djanet Oasis' => ['latitude' => 24.5542, 'longitude' => 9.4847],
            'Ghardaia M\'Zab Valley' => ['latitude' => 32.4833, 'longitude' => 3.6833],
            'Constantine Bridges' => ['latitude' => 36.3650, 'longitude' => 6.6147],
            'Timgad Roman City' => ['latitude' => 35.4850, 'longitude' => 6.4653],
            'Djemila Archaeological Site' => ['latitude' => 36.3197, 'longitude' => 5.7356],
            'Oran Waterfront' => ['latitude' => 35.6969, 'longitude' => -0.6331],
            'Annaba Beaches' => ['latitude' => 36.9000, 'longitude' => 7.7667],
            'Tlemcen Great Mosque' => ['latitude' => 34.8783, 'longitude' => -1.3150],
            'Beni Isguen' => ['latitude' => 32.4875, 'longitude' => 3.6736],
            'Setif Roman Theatre' => ['latitude' => 36.1900, 'longitude' => 5.4100],
            'Batna Aures Mountains' => ['latitude' => 35.5556, 'longitude' => 6.1742],
            'El Oued Sand Dunes' => ['latitude' => 33.3667, 'longitude' => 6.8667],
        ];

        foreach ($coordinates as $name => $coords) {
            Destination::where('name', $name)->update([
                'latitude' => $coords['latitude'],
                'longitude' => $coords['longitude'],
            ]);
        }

        $this->command->info('Destination coordinates updated successfully!');
    }
}
