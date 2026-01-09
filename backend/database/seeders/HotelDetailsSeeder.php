<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;
use App\Models\HotelSpecification;

class HotelDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hotels = Hotel::all();

        if ($hotels->isEmpty()) {
            if ($this->command) {
                $this->command->warn('No hotels found. Please run AlgeriaHotelsSeeder first.');
            }
            return;
        }

        $hotelDetails = [
            'Novotel Constantine' => [
                'address' => 'Boulevard de l\'ALN, Constantine 25000',
                'phone' => '+213 31 92 00 00',
                'email' => 'info@novotel-constantine.dz',
                'website' => 'https://www.accorhotels.com/novotel-constantine',
                'star_rating' => 4,
                'price_per_night' => 12500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => true,
                    'has_gym' => true,
                    'has_spa' => true,
                    'has_restaurant' => true,
                    'has_bar' => true,
                    'has_room_service' => true,
                    'has_airport_shuttle' => true,
                    'has_pet_friendly' => false,
                    'has_air_conditioning' => true,
                    'has_laundry' => true,
                    'has_conference_room' => true,
                    'check_in_time' => '14:00',
                    'check_out_time' => '12:00',
                    'total_rooms' => 142,
                ],
            ],
            'Oasis Hotel Algiers' => [
                'address' => 'Avenue Mohamed Khemisti, Algiers 16000',
                'phone' => '+213 21 63 80 80',
                'email' => 'contact@oasishotel-algiers.dz',
                'website' => 'https://www.oasishotel-algiers.com',
                'star_rating' => 5,
                'price_per_night' => 18500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => true,
                    'has_gym' => true,
                    'has_spa' => true,
                    'has_restaurant' => true,
                    'has_bar' => true,
                    'has_room_service' => true,
                    'has_airport_shuttle' => true,
                    'has_pet_friendly' => true,
                    'has_air_conditioning' => true,
                    'has_laundry' => true,
                    'has_conference_room' => true,
                    'check_in_time' => '15:00',
                    'check_out_time' => '12:00',
                    'total_rooms' => 210,
                ],
            ],
            'Sofi Hotel Oran' => [
                'address' => 'Boulevard de la Révolution, Oran 31000',
                'phone' => '+213 41 33 70 70',
                'email' => 'reservations@sofihotel-oran.dz',
                'website' => 'https://www.sofihotel-oran.com',
                'star_rating' => 3,
                'price_per_night' => 8500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => false,
                    'has_gym' => false,
                    'has_spa' => false,
                    'has_restaurant' => true,
                    'has_bar' => false,
                    'has_room_service' => true,
                    'has_airport_shuttle' => false,
                    'has_pet_friendly' => false,
                    'has_air_conditioning' => true,
                    'has_laundry' => true,
                    'has_conference_room' => true,
                    'check_in_time' => '14:00',
                    'check_out_time' => '11:00',
                    'total_rooms' => 85,
                ],
            ],
            'Sabri Hotel Annaba' => [
                'address' => 'Avenue de la Révolution, Annaba 23000',
                'phone' => '+213 38 86 55 55',
                'email' => 'info@sabrihotel-annaba.dz',
                'website' => 'https://www.sabrihotel-annaba.com',
                'star_rating' => 4,
                'price_per_night' => 11000.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => true,
                    'has_gym' => true,
                    'has_spa' => false,
                    'has_restaurant' => true,
                    'has_bar' => true,
                    'has_room_service' => true,
                    'has_airport_shuttle' => true,
                    'has_pet_friendly' => false,
                    'has_air_conditioning' => true,
                    'has_laundry' => true,
                    'has_conference_room' => false,
                    'check_in_time' => '14:00',
                    'check_out_time' => '12:00',
                    'total_rooms' => 96,
                ],
            ],
            'Aures Residence Batna' => [
                'address' => 'Rue Larbi Ben M\'hidi, Batna 05000',
                'phone' => '+213 33 80 25 25',
                'email' => 'contact@auresresidence.dz',
                'website' => 'https://www.auresresidence-batna.com',
                'star_rating' => 3,
                'price_per_night' => 7500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => false,
                    'has_gym' => false,
                    'has_spa' => false,
                    'has_restaurant' => true,
                    'has_bar' => false,
                    'has_room_service' => false,
                    'has_airport_shuttle' => false,
                    'has_pet_friendly' => true,
                    'has_air_conditioning' => true,
                    'has_laundry' => false,
                    'has_conference_room' => false,
                    'check_in_time' => '13:00',
                    'check_out_time' => '11:00',
                    'total_rooms' => 42,
                ],
            ],
            'Hussein Hotel Constantine' => [
                'address' => 'Boulevard Rahmani Achour, Constantine 25000',
                'phone' => '+213 31 92 45 45',
                'email' => 'reservations@husseinhotel.dz',
                'website' => 'https://www.husseinhotel-constantine.com',
                'star_rating' => 4,
                'price_per_night' => 13500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => true,
                    'has_gym' => true,
                    'has_spa' => true,
                    'has_restaurant' => true,
                    'has_bar' => true,
                    'has_room_service' => true,
                    'has_airport_shuttle' => true,
                    'has_pet_friendly' => false,
                    'has_air_conditioning' => true,
                    'has_laundry' => true,
                    'has_conference_room' => true,
                    'check_in_time' => '15:00',
                    'check_out_time' => '12:00',
                    'total_rooms' => 165,
                ],
            ],
            'Hôtel Césarée Tipaza' => [
                'address' => 'Rue des Ruines Romaines, Tipaza 42000',
                'phone' => '+213 24 47 72 72',
                'email' => 'info@hotelcesaree.dz',
                'website' => 'https://www.hotelcesaree-tipaza.com',
                'star_rating' => 4,
                'price_per_night' => 10500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => false,
                    'has_gym' => false,
                    'has_spa' => false,
                    'has_restaurant' => true,
                    'has_bar' => true,
                    'has_room_service' => true,
                    'has_airport_shuttle' => false,
                    'has_pet_friendly' => false,
                    'has_air_conditioning' => true,
                    'has_laundry' => true,
                    'has_conference_room' => false,
                    'check_in_time' => '14:00',
                    'check_out_time' => '11:00',
                    'total_rooms' => 68,
                ],
            ],
            'Hôtel Grand Bassin Tlemcen' => [
                'address' => 'Avenue Commandant Djaber, Tlemcen 13000',
                'phone' => '+213 43 27 90 90',
                'email' => 'contact@grandbassinhotel.dz',
                'website' => 'https://www.grandbassinhotel-tlemcen.com',
                'star_rating' => 4,
                'price_per_night' => 11500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => true,
                    'has_gym' => true,
                    'has_spa' => false,
                    'has_restaurant' => true,
                    'has_bar' => false,
                    'has_room_service' => true,
                    'has_airport_shuttle' => true,
                    'has_pet_friendly' => false,
                    'has_air_conditioning' => true,
                    'has_laundry' => true,
                    'has_conference_room' => true,
                    'check_in_time' => '14:00',
                    'check_out_time' => '12:00',
                    'total_rooms' => 128,
                ],
            ],
            'Atlantis Hôtel Bejaia' => [
                'address' => 'Boulevard de la Liberté, Bejaia 06000',
                'phone' => '+213 34 21 90 00',
                'email' => 'reservations@atlantishotel-bejaia.dz',
                'website' => 'https://www.atlantishotel-bejaia.com',
                'star_rating' => 5,
                'price_per_night' => 16500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => true,
                    'has_gym' => true,
                    'has_spa' => true,
                    'has_restaurant' => true,
                    'has_bar' => true,
                    'has_room_service' => true,
                    'has_airport_shuttle' => true,
                    'has_pet_friendly' => false,
                    'has_air_conditioning' => true,
                    'has_laundry' => true,
                    'has_conference_room' => true,
                    'check_in_time' => '15:00',
                    'check_out_time' => '12:00',
                    'total_rooms' => 185,
                ],
            ],
            'Gîte TARIST Ghardaïa' => [
                'address' => 'Quartier Beni Isguen, Ghardaïa 47000',
                'phone' => '+213 29 88 45 45',
                'email' => 'info@gitetarist.dz',
                'website' => 'https://www.gitetarist-ghardaia.com',
                'star_rating' => 3,
                'price_per_night' => 6500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => false,
                    'has_gym' => false,
                    'has_spa' => false,
                    'has_restaurant' => true,
                    'has_bar' => false,
                    'has_room_service' => false,
                    'has_airport_shuttle' => false,
                    'has_pet_friendly' => false,
                    'has_air_conditioning' => true,
                    'has_laundry' => false,
                    'has_conference_room' => false,
                    'check_in_time' => '12:00',
                    'check_out_time' => '10:00',
                    'total_rooms' => 28,
                ],
            ],
            'La Grotte des Ambassadeurs Hotel' => [
                'address' => 'Route de Tassili, Djanet 33000',
                'phone' => '+213 29 82 60 60',
                'email' => 'contact@lagrottehotel.dz',
                'website' => 'https://www.lagrottedesambassadeurs-djanet.com',
                'star_rating' => 3,
                'price_per_night' => 9500.00,
                'specs' => [
                    'has_wifi' => true,
                    'has_parking' => true,
                    'has_pool' => false,
                    'has_gym' => false,
                    'has_spa' => false,
                    'has_restaurant' => true,
                    'has_bar' => false,
                    'has_room_service' => true,
                    'has_airport_shuttle' => true,
                    'has_pet_friendly' => false,
                    'has_air_conditioning' => true,
                    'has_laundry' => false,
                    'has_conference_room' => false,
                    'check_in_time' => '13:00',
                    'check_out_time' => '11:00',
                    'total_rooms' => 45,
                ],
            ],
        ];

        // Default specifications for hotels not in the details list
        $defaultSpecs = [
            'has_wifi' => true,
            'has_parking' => true,
            'has_pool' => rand(0, 1),
            'has_gym' => rand(0, 1),
            'has_spa' => false,
            'has_restaurant' => true,
            'has_bar' => rand(0, 1),
            'has_room_service' => rand(0, 1),
            'has_airport_shuttle' => rand(0, 1),
            'has_pet_friendly' => false,
            'has_air_conditioning' => true,
            'has_laundry' => rand(0, 1),
            'has_conference_room' => rand(0, 1),
            'check_in_time' => '14:00',
            'check_out_time' => '12:00',
            'total_rooms' => rand(50, 150),
        ];

        foreach ($hotels as $hotel) {
            // Update hotel details
            if (isset($hotelDetails[$hotel->name])) {
                $details = $hotelDetails[$hotel->name];
                
                $hotel->update([
                    'address' => $details['address'],
                    'phone' => $details['phone'],
                    'email' => $details['email'],
                    'website' => $details['website'],
                    'star_rating' => $details['star_rating'],
                    'price_per_night' => $details['price_per_night'],
                ]);

                // Create or update specifications
                HotelSpecification::updateOrCreate(
                    ['hotel_id' => $hotel->id],
                    $details['specs']
                );
            } else {
                // Use default values for hotels not in the list
                $starRating = rand(3, 5);
                $basePrice = $starRating * 2500;
                
                $hotel->update([
                    'address' => $hotel->city . ', Algeria',
                    'phone' => '+213 ' . rand(20, 49) . ' ' . rand(10, 99) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                    'email' => 'info@' . strtolower(str_replace(' ', '', $hotel->name)) . '.dz',
                    'website' => 'https://www.' . strtolower(str_replace(' ', '-', $hotel->name)) . '.com',
                    'star_rating' => $starRating,
                    'price_per_night' => $basePrice + rand(-1000, 2000),
                ]);

                HotelSpecification::updateOrCreate(
                    ['hotel_id' => $hotel->id],
                    $defaultSpecs
                );
            }
        }

        if ($this->command) {
            $this->command->info('Hotel details and specifications updated successfully for ' . $hotels->count() . ' hotels!');
        }
    }
}
