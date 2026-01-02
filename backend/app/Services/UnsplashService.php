<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UnsplashService
{
    private string $accessKey;
    private ?string $secretKey;
    private string $baseUrl = 'https://api.unsplash.com';

    public function __construct()
    {
        $this->accessKey = config('services.unsplash.access_key');
        $this->secretKey = config('services.unsplash.secret_key');
    }

    /**
     * Search photos on Unsplash
     *
     * @param string $query
     * @param int $page
     * @param int $perPage
     * @return array
     */
    public function searchPhotos(string $query, int $page = 1, int $perPage = 12): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Client-ID ' . $this->accessKey,
                'Accept-Version' => 'v1',
            ])->get("{$this->baseUrl}/search/photos", [
                'query' => $query,
                'page' => $page,
                'per_page' => $perPage,
                'orientation' => 'landscape',
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Unsplash API error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return [
                'results' => [],
                'total' => 0,
                'total_pages' => 0
            ];
        } catch (\Exception $e) {
            Log::error('Unsplash API exception', [
                'message' => $e->getMessage()
            ]);

            return [
                'results' => [],
                'total' => 0,
                'total_pages' => 0
            ];
        }
    }

    /**
     * Download photo from Unsplash and track download
     *
     * @param string $photoId
     * @param string $downloadUrl
     * @return string|null Path to saved file
     */
    public function downloadPhoto(string $photoId, string $downloadUrl): ?string
    {
        try {
            // Track download as per Unsplash API guidelines
            $this->trackDownload($photoId);

            // Download the image
            $imageContent = Http::get($downloadUrl)->body();

            // Generate unique filename
            $filename = 'destinations/' . uniqid() . '_' . $photoId . '.jpg';

            // Store in public disk
            Storage::disk('public')->put($filename, $imageContent);

            return $filename;
        } catch (\Exception $e) {
            Log::error('Error downloading Unsplash photo', [
                'photo_id' => $photoId,
                'message' => $e->getMessage()
            ]);

            return null;
        }
    }

    /**
     * Track photo download (required by Unsplash API guidelines)
     *
     * @param string $photoId
     * @return void
     */
    private function trackDownload(string $photoId): void
    {
        try {
            Http::withHeaders([
                'Authorization' => 'Client-ID ' . $this->accessKey,
                'Accept-Version' => 'v1',
            ])->get("{$this->baseUrl}/photos/{$photoId}/download");
        } catch (\Exception $e) {
            Log::warning('Failed to track Unsplash download', [
                'photo_id' => $photoId,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get a random photo
     *
     * @param string|null $query
     * @return array|null
     */
    public function getRandomPhoto(?string $query = null): ?array
    {
        try {
            $params = [];
            if ($query) {
                $params['query'] = $query;
            }

            $response = Http::withHeaders([
                'Authorization' => 'Client-ID ' . $this->accessKey,
                'Accept-Version' => 'v1',
            ])->get("{$this->baseUrl}/photos/random", $params);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Unsplash random photo error', [
                'message' => $e->getMessage()
            ]);

            return null;
        }
    }
}
