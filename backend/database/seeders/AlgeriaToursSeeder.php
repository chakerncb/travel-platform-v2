<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tour;
use App\Models\Destination;
use App\Models\Hotel;
use Carbon\Carbon;

class AlgeriaToursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tours = [
            [
                'type' => 'pre_prepared',
                'title' => 'Discover Ancient Algiers - Heritage Tour',
                'short_description' => 'Explore the historic Casbah, colonial architecture, and vibrant markets of Algeria\'s capital city.',
                'description' => '<p>Experience the rich history and culture of Algiers on this comprehensive 3-day tour. Visit the UNESCO World Heritage Casbah, explore Ottoman palaces, and discover the blend of Arab, Ottoman, and French influences that make Algiers unique.</p><p>Walk through the narrow winding streets of the ancient medina, visit the Martyrs\' Memorial, and enjoy panoramic views from the Notre Dame d\'Afrique basilica.</p>',
                'price' => 45000.00,
                'duration_days' => 3,
                'max_group_size' => 15,
                'difficulty_level' => 'easy',
                'is_active' => true,
                'is_eco_friendly' => true,
                'included_services' => ['Accommodation', 'Guided tours', 'Entrance fees', 'Local transportation', 'Some meals'],
                'excluded_services' => ['International flights', 'Travel insurance', 'Personal expenses', 'Tips'],
                'start_date' => Carbon::now()->addDays(15),
                'end_date' => Carbon::now()->addDays(18),
                'destinations' => ['The Kasbah of Algiers', 'Tipasa Archaeological Park'],
                'destination_days' => [2, 1],
                'hotels' => ['Oasis Hotel Algiers', 'Hôtel Césarée Tipaza'],
                'hotel_nights' => [2, 1],
            ],
            [
                'type' => 'pre_prepared',
                'title' => 'Sahara Desert Adventure - Tassili n\'Ajjer',
                'short_description' => 'Trek through prehistoric rock art sites and camp under the stars in the stunning Sahara desert.',
                'description' => '<p>Embark on an unforgettable 7-day adventure into the heart of the Sahara Desert. Explore the UNESCO World Heritage site of Tassili n\'Ajjer, famous for its prehistoric cave paintings and dramatic sandstone formations.</p><p>Experience traditional desert life, camp under starlit skies, and witness breathtaking sunrises over ancient dunes. This tour combines cultural immersion with outdoor adventure.</p>',
                'price' => 125000.00,
                'duration_days' => 7,
                'max_group_size' => 12,
                'difficulty_level' => 'difficult',
                'is_active' => true,
                'is_eco_friendly' => true,
                'included_services' => ['Desert camping', '4x4 transportation', 'All meals', 'Expert guide', 'Camping equipment', 'Park fees'],
                'excluded_services' => ['Flights to Djanet', 'Personal gear', 'Travel insurance', 'Tips'],
                'start_date' => Carbon::now()->addDays(30),
                'end_date' => Carbon::now()->addDays(37),
                'destinations' => ['Tassili n\'Ajjer National Park'],
                'destination_days' => [7],
                'hotels' => ['La Grotte des Ambassadeurs Hotel'],
                'hotel_nights' => [2],
            ],
            [
                'type' => 'pre_prepared',
                'title' => 'Constantine & Timgad - Ancient Wonders',
                'short_description' => 'Discover the City of Bridges and the remarkably preserved Roman city of Timgad.',
                'description' => '<p>Join us for a 4-day journey through eastern Algeria\'s most impressive historical sites. Marvel at Constantine\'s dramatic suspension bridges spanning deep gorges, and explore Timgad, one of the best-preserved Roman cities in North Africa.</p><p>Visit the stunning Djemila archaeological site and experience the rich Berber culture of the region.</p>',
                'price' => 65000.00,
                'duration_days' => 4,
                'max_group_size' => 18,
                'difficulty_level' => 'easy',
                'is_active' => true,
                'is_eco_friendly' => false,
                'included_services' => ['Hotels', 'Breakfast & dinner', 'Professional guide', 'Transportation', 'Entrance fees'],
                'excluded_services' => ['Lunch', 'Drinks', 'Travel insurance', 'Tips', 'Personal expenses'],
                'start_date' => Carbon::now()->addDays(20),
                'end_date' => Carbon::now()->addDays(24),
                'destinations' => ['The Hanging Bridges of Constantine', 'Timgad Roman Ruins', 'Djémila Ruins'],
                'destination_days' => [1, 2, 1],
                'hotels' => ['Novotel Constantine', 'Hussein Hotel Constantine'],
                'hotel_nights' => [2, 2],
            ],
            [
                'type' => 'pre_prepared',
                'title' => 'Coastal Beauty - Bejaia & Gouraya',
                'short_description' => 'Experience the pristine coastline and protected national park of Bejaia.',
                'description' => '<p>Discover the stunning Mediterranean coast on this 5-day eco-tourism adventure. Explore Gouraya National Park with its diverse wildlife and hiking trails, relax on pristine beaches, and enjoy fresh seafood in coastal towns.</p><p>This eco-friendly tour focuses on sustainable tourism and conservation while providing unforgettable coastal experiences.</p>',
                'price' => 55000.00,
                'duration_days' => 5,
                'max_group_size' => 12,
                'difficulty_level' => 'moderate',
                'is_active' => true,
                'is_eco_friendly' => true,
                'included_services' => ['Eco-lodge accommodation', 'All meals', 'Park guides', 'Hiking equipment', 'Beach activities'],
                'excluded_services' => ['Transportation to Bejaia', 'Travel insurance', 'Personal items', 'Optional activities'],
                'start_date' => Carbon::now()->addDays(25),
                'end_date' => Carbon::now()->addDays(30),
                'destinations' => ['Bejaia Corniche', 'Gouraya National Park'],
                'destination_days' => [2, 3],
                'hotels' => ['Atlantis Hôtel Bejaia'],
                'hotel_nights' => [4],
            ],
            [
                'type' => 'pre_prepared',
                'title' => 'M\'Zab Valley Cultural Discovery',
                'short_description' => 'Explore the unique architecture and culture of the M\'Zab Valley UNESCO site.',
                'description' => '<p>Journey into the heart of the Sahara to discover the remarkable pentapolis of the M\'Zab Valley. This 4-day cultural tour takes you through five ancient fortified cities (ksour) built around oases.</p><p>Experience the unique Mozabite culture, admire the distinctive architecture, and learn about traditional water management systems that have sustained life in the desert for centuries.</p>',
                'price' => 58000.00,
                'duration_days' => 4,
                'max_group_size' => 15,
                'difficulty_level' => 'easy',
                'is_active' => true,
                'is_eco_friendly' => true,
                'included_services' => ['Guesthouse accommodation', 'Cultural guide', 'All meals', 'Transportation', 'Site visits'],
                'excluded_services' => ['Flights', 'Travel insurance', 'Tips', 'Souvenirs'],
                'start_date' => Carbon::now()->addDays(35),
                'end_date' => Carbon::now()->addDays(39),
                'destinations' => ['M\'Zab Valley'],
                'destination_days' => [4],
                'hotels' => ['Gîte TARIST Ghardaïa'],
                'hotel_nights' => [3],
            ],
            [
                'type' => 'pre_prepared',
                'title' => 'Hoggar Mountains Expedition',
                'short_description' => 'Trek through volcanic landscapes and visit Tuareg communities in the Hoggar.',
                'description' => '<p>Experience the otherworldly beauty of the Hoggar Mountains on this 6-day expedition. Trek through volcanic peaks, explore ancient rock art, and meet Tuareg nomads who have called these mountains home for millennia.</p><p>Climb Assekrem peak for sunrise views and camp in dramatic desert landscapes. This challenging trek rewards adventurers with unforgettable scenery and cultural encounters.</p>',
                'price' => 98000.00,
                'duration_days' => 6,
                'max_group_size' => 10,
                'difficulty_level' => 'difficult',
                'is_active' => true,
                'is_eco_friendly' => true,
                'included_services' => ['Mountain camping', '4x4 support vehicle', 'Expert mountain guide', 'All meals', 'Camping gear', 'Porter service'],
                'excluded_services' => ['Flights to Tamanrasset', 'Personal equipment', 'Insurance', 'Tips'],
                'start_date' => Carbon::now()->addDays(40),
                'end_date' => Carbon::now()->addDays(46),
                'destinations' => ['Assekram'],
                'destination_days' => [6],
                'hotels' => [],
                'hotel_nights' => [],
            ],
            [
                'type' => 'pre_prepared',
                'title' => 'Oran & Tlemcen - Western Heritage',
                'short_description' => 'Discover the Spanish and Andalusian influences in western Algeria.',
                'description' => '<p>Explore the vibrant cities of western Algeria on this 5-day cultural tour. Visit Oran\'s Spanish fortresses and bustling waterfront, then journey to Tlemcen to discover magnificent mosques, palaces, and Andalusian gardens.</p><p>Experience the unique blend of Arab, Berber, and European cultures that characterize this region.</p>',
                'price' => 52000.00,
                'duration_days' => 5,
                'max_group_size' => 16,
                'difficulty_level' => 'easy',
                'is_active' => true,
                'is_eco_friendly' => false,
                'included_services' => ['Hotels', 'Daily breakfast', 'City tours', 'Transport', 'Guide services'],
                'excluded_services' => ['Lunch & dinner', 'Entrance fees', 'Travel insurance', 'Personal expenses'],
                'start_date' => Carbon::now()->addDays(18),
                'end_date' => Carbon::now()->addDays(23),
                'destinations' => ['Santa Cruz Fort', 'Great Mosque of Tlemcen'],
                'destination_days' => [3, 2],
                'hotels' => ['Sofi Hotel Oran', 'Hôtel Grand Bassin Tlemcen'],
                'hotel_nights' => [2, 3],
            ],
            [
                'type' => 'pre_prepared',
                'title' => 'Aures Mountains Nature Trek',
                'short_description' => 'Hike through Berber villages and stunning mountain scenery.',
                'description' => '<p>Discover the natural beauty and Berber culture of the Aures Mountains on this 5-day eco-trek. Walk through terraced villages, meet local communities, and explore the dramatic Ghoufi Canyon.</p><p>This sustainable tourism experience supports local communities while offering authentic cultural immersion and spectacular mountain landscapes.</p>',
                'price' => 48000.00,
                'duration_days' => 5,
                'max_group_size' => 12,
                'difficulty_level' => 'moderate',
                'is_active' => true,
                'is_eco_friendly' => true,
                'included_services' => ['Guesthouse stays', 'Home-cooked meals', 'Local guides', 'Trekking equipment', 'Village visits'],
                'excluded_services' => ['Transportation to Batna', 'Travel insurance', 'Tips', 'Personal gear'],
                'start_date' => Carbon::now()->addDays(28),
                'end_date' => Carbon::now()->addDays(33),
                'destinations' => ['Ghoufi Canyon', 'Timgad Roman Ruins'],
                'destination_days' => [4, 1],
                'hotels' => ['Aures Residence Batna'],
                'hotel_nights' => [4],
            ],
            [
                'type' => 'pre_prepared',
                'title' => 'Complete Algeria Grand Tour',
                'short_description' => 'A comprehensive journey through Algeria\'s most iconic destinations.',
                'description' => '<p>Experience the best of Algeria on this epic 14-day grand tour. From the Mediterranean coast to the Sahara Desert, visit UNESCO World Heritage sites, ancient Roman ruins, dramatic mountains, and vibrant cities.</p><p>This comprehensive tour covers Algeria\'s diverse landscapes, rich history, and cultural heritage. Perfect for those who want to see it all.</p>',
                'price' => 185000.00,
                'duration_days' => 14,
                'max_group_size' => 20,
                'difficulty_level' => 'moderate',
                'is_active' => true,
                'is_eco_friendly' => false,
                'included_services' => ['All accommodation', 'Most meals', 'Internal flights', 'Ground transportation', 'Expert guides', 'Entrance fees'],
                'excluded_services' => ['International flights', 'Some meals', 'Travel insurance', 'Visa fees', 'Tips', 'Personal expenses'],
                'start_date' => Carbon::now()->addDays(45),
                'end_date' => Carbon::now()->addDays(59),
                'destinations' => ['The Kasbah of Algiers', 'Tipasa Archaeological Park', 'Santa Cruz Fort', 'Great Mosque of Tlemcen', 'The Hanging Bridges of Constantine', 'Timgad Roman Ruins', 'M\'Zab Valley', 'Tassili n\'Ajjer National Park'],
                'destination_days' => [2, 1, 2, 1, 2, 1, 2, 3],
                'hotels' => ['Oasis Hotel Algiers', 'Sofi Hotel Oran', 'Hôtel Grand Bassin Tlemcen', 'Novotel Constantine', 'Gîte TARIST Ghardaïa', 'La Grotte des Ambassadeurs Hotel'],
                'hotel_nights' => [3, 2, 1, 3, 2, 3],
            ],
            [
                'type' => 'pre_prepared',
                'title' => 'Annaba & Ancient Hippo Regius',
                'short_description' => 'Explore coastal beauty and Roman history in northeastern Algeria.',
                'description' => '<p>Discover the charm of Annaba and its rich Roman heritage on this 3-day tour. Visit the archaeological site of Hippo Regius, once home to Saint Augustine, explore beautiful beaches, and enjoy the city\'s unique blend of French colonial and modern architecture.</p>',
                'price' => 38000.00,
                'duration_days' => 3,
                'max_group_size' => 14,
                'difficulty_level' => 'easy',
                'is_active' => true,
                'is_eco_friendly' => false,
                'included_services' => ['Hotel accommodation', 'Breakfast', 'Guided tours', 'Transportation', 'Site entrance'],
                'excluded_services' => ['Lunch & dinner', 'Travel insurance', 'Personal items', 'Tips'],
                'start_date' => Carbon::now()->addDays(22),
                'end_date' => Carbon::now()->addDays(25),
                'destinations' => ['Hippo Regius'],
                'destination_days' => [3],
                'hotels' => ['Sabri Hotel Annaba'],
                'hotel_nights' => [2],
            ],
        ];

        foreach ($tours as $tourData) {
            // Extract relationships data
            $destinationNames = $tourData['destinations'];
            $destinationDays = $tourData['destination_days'];
            $hotelNames = $tourData['hotels'];
            $hotelNights = $tourData['hotel_nights'];
            
            unset($tourData['destinations'], $tourData['destination_days'], $tourData['hotels'], $tourData['hotel_nights']);

            // Create tour
            $tour = Tour::create($tourData);

            // Attach destinations
            foreach ($destinationNames as $index => $destinationName) {
                $destination = Destination::where('name', $destinationName)->first();
                if ($destination) {
                    $tour->destinations()->attach($destination->id, [
                        'order' => $index + 1,
                        'days_at_destination' => $destinationDays[$index],
                    ]);
                }
            }

            // Attach hotels
            foreach ($hotelNames as $index => $hotelName) {
                $hotel = Hotel::where('name', $hotelName)->first();
                if ($hotel) {
                    $tour->hotels()->attach($hotel->id, [
                        'order' => $index + 1,
                        'nights' => $hotelNights[$index],
                    ]);
                }
            }
        }

        if ($this->command) {
            $this->command->info('Algeria tours seeded successfully! Created ' . count($tours) . ' tours.');
        }
    }
}
