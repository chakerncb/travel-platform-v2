<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Destination;
use App\Models\DestinationImage;

class DestinationImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all destinations
        $destinations = Destination::all();

        if ($destinations->isEmpty()) {
            if ($this->command) {
                $this->command->warn('No destinations found. Please run AlgeriaDestinationsSeeder first.');
            }
            return;
        }

        // Get all images from storage/app/public/destinations
        $storagePath = storage_path('app/public/destinations');
        
        if (!is_dir($storagePath)) {
            if ($this->command) {
                $this->command->error('Destinations images directory not found!');
            }
            return;
        }

        $imageFiles = array_values(array_diff(scandir($storagePath), ['.', '..']));
        
        if (empty($imageFiles)) {
            if ($this->command) {
                $this->command->error('No images found in destinations folder!');
            }
            return;
        }

        foreach ($destinations as $index => $destination) {
            // Clear existing images for this destination
            DestinationImage::where('destination_id', $destination->id)->delete();

            // Add 3-5 images per destination
            $imageCount = min(rand(3, 5), count($imageFiles));
            
            for ($i = 0; $i < $imageCount; $i++) {
                // Cycle through available images
                $imageFile = $imageFiles[($index * $imageCount + $i) % count($imageFiles)];
                $imagePath = 'destinations/' . $imageFile;
                
                DestinationImage::create([
                    'destination_id' => $destination->id,
                    'image_path' => $imagePath,
                    'alt_text' => $destination->name . ' - View ' . ($i + 1),
                    'is_primary' => $i === 0, // First image is primary
                    'order' => $i + 1,
                    'photographer_name' => 'Travel Photographer',
                    'photographer_url' => null,
                    'source_url' => null,
                ]);
            }
        }

        if ($this->command) {
            $this->command->info('Destination images seeded successfully! Added images for ' . $destinations->count() . ' destinations.');
        }
    }
}
