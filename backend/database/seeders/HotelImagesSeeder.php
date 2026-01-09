<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;
use App\Models\HotelImage;

class HotelImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all hotels
        $hotels = Hotel::all();

        if ($hotels->isEmpty()) {
            if ($this->command) {
                $this->command->warn('No hotels found. Please run AlgeriaHotelsSeeder first.');
            }
            return;
        }

        // Get all images from storage/app/public/hotels
        $storagePath = storage_path('app/public/hotels');
        
        if (!is_dir($storagePath)) {
            if ($this->command) {
                $this->command->error('Hotels images directory not found!');
            }
            return;
        }

        $imageFiles = array_values(array_diff(scandir($storagePath), ['.', '..']));
        
        if (empty($imageFiles)) {
            if ($this->command) {
                $this->command->error('No images found in hotels folder!');
            }
            return;
        }

        foreach ($hotels as $index => $hotel) {
            // Clear existing images for this hotel
            HotelImage::where('hotel_id', $hotel->id)->delete();

            // Add images per hotel (limited by available images)
            $imageCount = min(count($imageFiles), rand(2, 3));
            
            for ($i = 0; $i < $imageCount; $i++) {
                // Cycle through available images
                $imageFile = $imageFiles[($index * $imageCount + $i) % count($imageFiles)];
                $imagePath = 'hotels/' . $imageFile;
                
                HotelImage::create([
                    'hotel_id' => $hotel->id,
                    'image_path' => $imagePath,
                    'alt_text' => $hotel->name . ' - ' . $this->getImageType($i),
                    'is_primary' => $i === 0, // First image is primary
                    'order' => $i + 1,
                ]);
            }
        }

        if ($this->command) {
            $this->command->info('Hotel images seeded successfully! Added images for ' . $hotels->count() . ' hotels.');
        }
    }

    /**
     * Get image type description based on index
     */
    private function getImageType(int $index): string
    {
        $types = ['Exterior', 'Lobby', 'Room', 'Restaurant', 'Pool', 'Amenities'];
        return $types[$index % count($types)];
    }
}
