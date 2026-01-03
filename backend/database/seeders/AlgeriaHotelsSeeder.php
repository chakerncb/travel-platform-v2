<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Hotel;

class AlgeriaHotelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hotels = [
            [
                "name" => "Novotel Constantine",
                "latitude" => 36.3653,
                "longitude" => 6.6119,
                "description" => "<p>A modern 4-star hotel offering panoramic views of the Rhumel Gorge and the city's iconic bridges. Features a fitness center, sauna, and an on-site French restaurant.</p>",
                "city" => "Constantine",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Oasis Hotel Algiers",
                "latitude" => 36.7322,
                "longitude" => 3.0855,
                "description" => "<p>A 5-star luxury hotel blending Moorish architecture with modern comfort. It features a spa, gym, and a seasonal outdoor pool, making it a perfect retreat near the city center.</p>",
                "city" => "Algiers",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Sofi Hotel Oran",
                "latitude" => 35.7025,
                "longitude" => -0.6358,
                "description" => "<p>An informal yet highly professional 3-star property located in the heart of Oran. It offers meeting spaces, a restaurant, and easy access to historic landmarks like Santa Cruz Fort.</p>",
                "city" => "Oran",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Sabri Hotel Annaba",
                "latitude" => 36.9247,
                "longitude" => 7.7611,
                "description" => "<p>A 4-star coastal hotel featuring a terrace with stunning views of the Mediterranean. Known for its proximity to the Hippo Regius ruins and its family-friendly pool area.</p>",
                "city" => "Annaba",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Aures Residence Batna",
                "latitude" => 35.5536,
                "longitude" => 6.1741,
                "description" => "<p>A top-rated residence offering comfortable and affordable lodging. It serves as an excellent base for exploring the nearby Timgad Roman Ruins and the Ghoufi Canyon.</p>",
                "city" => "Batna",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Hussein Hotel Constantine",
                "latitude" => 36.3421,
                "longitude" => 6.6342,
                "description" => "<p>A high-rise 4-star hotel featuring comprehensive wellness facilities, including indoor and outdoor pools and a traditional Algerian hammam.</p>",
                "city" => "Constantine",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Hôtel Césarée Tipaza",
                "latitude" => 36.5897,
                "longitude" => 2.4431,
                "description" => "<p>A high-quality hotel located in the historic heart of Tipaza. It offers a sophisticated atmosphere and easy walking distance to the UNESCO-listed Roman ruins and the port.</p>",
                "city" => "Tipaza",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Hôtel Grand Bassin Tlemcen",
                "latitude" => 34.8828,
                "longitude" => -1.3167,
                "description" => "<p>A 4-star hotel located near the historic Grand Bassin. It offers elegant rooms and is conveniently positioned for visiting the Great Mosque of Tlemcen and the Mansourah ruins.</p>",
                "city" => "Tlemcen",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Atlantis Hôtel Bejaia",
                "latitude" => 36.7512,
                "longitude" => 5.0645,
                "description" => "<p>A luxurious 5-star hotel offering a spa, outdoor pool, and stately rooms. It provides excellent access to Gouraya National Park and the scenic Bejaia Corniche.</p>",
                "city" => "Bejaia",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Gîte TARIST Ghardaïa",
                "latitude" => 32.4833,
                "longitude" => 3.6667,
                "description" => "<p>A highly-rated traditional guesthouse offering an authentic experience in the M'Zab Valley. Known for its traditional architecture and warm Saharan hospitality.</p>",
                "city" => "Ghardaïa",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "La Grotte des Ambassadeurs Hotel",
                "latitude" => 24.5558,
                "longitude" => 9.4852,
                "description" => "<p>A unique desert hotel in Djanet providing a comfortable gateway for excursions into the Tassili n'Ajjer National Park. Features local architectural styles.</p>",
                "city" => "Djanet",
                "country" => "Algeria",
                "is_active" => true
            ]
        ];

        foreach ($hotels as $hotel) {
            Hotel::create($hotel);
        }
    }
}
