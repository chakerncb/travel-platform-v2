<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Destination;

class AlgeriaDestinationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $destinations = [
            [
                "name" => "The Kasbah of Algiers",
                "latitude" => 36.7845,
                "longitude" => 3.0592,
                "description" => "A UNESCO World Heritage site featuring an ancient citadel and Ottoman-style palaces nestled in a labyrinth of narrow streets.",
                "short_description" => "Historic Ottoman quarter and UNESCO site in the capital.",
                "city" => "Algiers",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Sidi M'Cid Suspension Bridge",
                "latitude" => 36.3712,
                "longitude" => 6.6133,
                "description" => "An iconic suspension bridge hanging 175 meters above the Rhumel Gorge, offering panoramic views of the 'City of Bridges'.",
                "short_description" => "Spectacular cliffside bridge in Constantine.",
                "city" => "Constantine",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Santa Cruz Fort",
                "latitude" => 35.7094,
                "longitude" => -0.6653,
                "description" => "A 16th-century fortress built by the Spanish on the Pic d'Aidour, overlooking the Gulf of Oran.",
                "short_description" => "Spanish-built fortress with sea views.",
                "city" => "Oran",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Timgad Roman Ruins",
                "latitude" => 35.4844,
                "longitude" => 6.4678,
                "description" => "Known as the 'Pompeii of Africa,' this remarkably preserved Roman military colony features a perfect grid plan.",
                "short_description" => "Extensive UNESCO-listed Roman archaeological site.",
                "city" => "Batna",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Tassili n'Ajjer National Park",
                "latitude" => 24.8667,
                "longitude" => 9.4667,
                "description" => "A vast Saharan plateau featuring one of the most important groupings of prehistoric cave art in the world.",
                "short_description" => "Ancient rock art and surreal desert landscapes.",
                "city" => "Djanet",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "M'Zab Valley",
                "latitude" => 32.4833,
                "longitude" => 3.6667,
                "description" => "A traditional human habitat consisting of five fortified villages (ksour) built in the 10th century.",
                "short_description" => "Ancient fortified desert oases and UNESCO site.",
                "city" => "Ghardaïa",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Tipasa Archaeological Park",
                "latitude" => 36.5925,
                "longitude" => 2.4419,
                "description" => "A scenic archaeological site on the Mediterranean coast containing Phoenician, Roman, and Byzantine ruins.",
                "short_description" => "Coastal Roman ruins and ancient trading post.",
                "city" => "Tipaza",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Royal Mausoleum of Mauretania",
                "latitude" => 36.5744,
                "longitude" => 2.5522,
                "description" => "A funerary monument located on the road between Cherchell and Algiers, tomb of Juba II and Cleopatra Selene II.",
                "short_description" => "Ancient Numidian circular tomb.",
                "city" => "Sidi Rached",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Djémila Ruins",
                "latitude" => 36.3181,
                "longitude" => 5.8672,
                "description" => "A mountain village housing some of the best-preserved Roman ruins in North Africa, including a forum and theater.",
                "short_description" => "Mountainous Roman ruins in the Sétif region.",
                "city" => "Sétif",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Great Mosque of Tlemcen",
                "latitude" => 34.8822,
                "longitude" => -1.3117,
                "description" => "One of the most important Islamic buildings in North Africa, showcasing exquisite Almoravid architecture.",
                "short_description" => "Masterpiece of medieval Islamic architecture.",
                "city" => "Tlemcen",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Notre Dame d'Afrique",
                "latitude" => 36.7914,
                "longitude" => 3.0422,
                "description" => "A Catholic basilica overlooking the Bay of Algiers, famous for its Neo-Byzantine architecture.",
                "short_description" => "Historic basilica overlooking the Algiers bay.",
                "city" => "Algiers",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Assekram",
                "latitude" => 23.2667,
                "longitude" => 5.5333,
                "description" => "A high plateau in the Hoggar Mountains offering one of the most famous sunrises in the Sahara desert.",
                "short_description" => "Stunning Saharan peak and sunrise viewpoint.",
                "city" => "Tamanrasset",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Lalla Setti Plateau",
                "latitude" => 34.8694,
                "longitude" => -1.3250,
                "description" => "A popular lookout point and park overlooking the city of Tlemcen with family-friendly amenities.",
                "short_description" => "Scenic hilltop park and viewpoint.",
                "city" => "Tlemcen",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Bejaia Corniche",
                "latitude" => 36.7511,
                "longitude" => 5.0833,
                "description" => "A scenic coastal road and cliffside walk offering views of the Mediterranean and the Port of Bejaia.",
                "short_description" => "Beautiful coastal cliffs and sea views.",
                "city" => "Bejaia",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Ghoufi Canyon",
                "latitude" => 35.0500,
                "longitude" => 6.1667,
                "description" => "A historic settlement located in a canyon, often compared to the Grand Canyon with its ancient cliff dwellings.",
                "short_description" => "Ancient Berber balcony and deep desert canyon.",
                "city" => "Batna",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Hippo Regius",
                "latitude" => 36.8833,
                "longitude" => 7.7500,
                "description" => "The ancient name of the city of Annaba, containing ruins where St. Augustine lived and preached.",
                "short_description" => "Historic ruins and site of St. Augustine's life.",
                "city" => "Annaba",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "The Hanging Bridges of Constantine",
                "latitude" => 36.3650,
                "longitude" => 6.6147,
                "description" => "A series of historic and modern bridges connecting the rocky peaks of Constantine over the Rhumel river.",
                "short_description" => "Collection of dramatic architectural bridges.",
                "city" => "Constantine",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Chréa National Park",
                "latitude" => 36.4214,
                "longitude" => 2.8778,
                "description" => "One of the smallest national parks in Algeria, home to an ancient cedar forest and a ski resort.",
                "short_description" => "Mountainous forest and winter sports hub.",
                "city" => "Blida",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Gouraya National Park",
                "latitude" => 36.7667,
                "longitude" => 5.0833,
                "description" => "A coastal national park featuring Monkey Peak and beautiful Mediterranean beaches.",
                "short_description" => "Coastal mountain park with diverse wildlife.",
                "city" => "Bejaia",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "El Kala National Park",
                "latitude" => 36.8833,
                "longitude" => 8.3333,
                "description" => "A UNESCO biosphere reserve with diverse ecosystems, including lakes, forests, and marine areas.",
                "short_description" => "Biodiverse wetland and forest reserve.",
                "city" => "El Tarf",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Martyrs' Memorial",
                "latitude" => 36.7458,
                "longitude" => 3.0597,
                "description" => "An iconic concrete monument commemorating the Algerian war for independence, standing high above Algiers.",
                "short_description" => "Grand monument and symbol of independence.",
                "city" => "Algiers",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Beni Hammad Fort",
                "latitude" => 35.8189,
                "longitude" => 4.7861,
                "description" => "The ruins of the first capital of the Hammadid emirs, providing an authentic picture of a fortified Muslim city.",
                "short_description" => "Ancient ruins of a fortified Islamic capital.",
                "city" => "M'Sila",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Taghit Oasis",
                "latitude" => 30.9167,
                "longitude" => -2.0333,
                "description" => "A stunning desert town famous for its red mud-brick architecture and massive sand dunes.",
                "short_description" => "Iconic Saharan oasis with red sand dunes.",
                "city" => "Béchar",
                "country" => "Algeria",
                "is_active" => true
            ],
            [
                "name" => "Timimoun Ksar",
                "latitude" => 29.2639,
                "longitude" => 0.2317,
                "description" => "A city built in the 'red oasis' style with unique Sudanese-influenced architecture.",
                "short_description" => "Red-walled desert city in the Adrar region.",
                "city" => "Timimoun",
                "country" => "Algeria",
                "is_active" => true
            ]
        ];

        foreach ($destinations as $destination) {
            Destination::create($destination);
        }
    }
}
