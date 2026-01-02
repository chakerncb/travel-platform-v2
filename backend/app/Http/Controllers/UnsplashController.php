<?php

namespace App\Http\Controllers;

use App\Services\UnsplashService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\DestinationImage;

class UnsplashController extends Controller
{
    protected UnsplashService $unsplashService;

    public function __construct(UnsplashService $unsplashService)
    {
        $this->unsplashService = $unsplashService;
    }

    /**
     * Search photos on Unsplash
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|max:255',
            'page' => 'nullable|integer|min:1'
        ]);

        $results = $this->unsplashService->searchPhotos(
            $request->input('query'),
            $request->input('page', 1),
            12
        );

        return response()->json($results);
    }

    /**
     * Download and save Unsplash photo for a destination
     */
    public function download(Request $request)
    {
        $request->validate([
            'destination_id' => 'required|exists:destinations,id',
            'photo_id' => 'required|string',
            'download_url' => 'required|url',
            'photographer_name' => 'required|string',
            'photographer_username' => 'required|string',
            'unsplash_url' => 'required|url',
            'is_primary' => 'nullable|boolean',
        ]);

        try {
            // Download the photo
            $filePath = $this->unsplashService->downloadPhoto(
                $request->input('photo_id'),
                $request->input('download_url')
            );

            if (!$filePath) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to download image'
                ], 500);
            }

            // If this is set as primary, unset other primary images
            if ($request->input('is_primary')) {
                DestinationImage::where('destination_id', $request->input('destination_id'))
                    ->update(['is_primary' => false]);
            }

            // Create destination image record
            $destinationImage = DestinationImage::create([
                'destination_id' => $request->input('destination_id'),
                'image_path' => $filePath,
                'is_primary' => $request->input('is_primary', false),
                'order' => DestinationImage::where('destination_id', $request->input('destination_id'))->max('order') + 1,
                'photographer_name' => $request->input('photographer_name'),
                'photographer_url' => 'https://unsplash.com/@' . $request->input('photographer_username'),
                'source_url' => $request->input('unsplash_url'),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Image downloaded and saved successfully',
                'image' => $destinationImage
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
