<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AmadeusService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FlightController extends Controller
{
    protected $amadeusService;

    public function __construct(AmadeusService $amadeusService)
    {
        $this->amadeusService = $amadeusService;
    }

    /**
     * Get 2-letter ISO country code (alpha-2) from country name
     * Amadeus API requires 2-letter codes, not 3-letter codes
     */
    private function getCountryCode(string $countryName): ?string
    {
        $countriesPath = public_path('countries.json');
        if (!file_exists($countriesPath)) {
            return null;
        }

        $countries = json_decode(file_get_contents($countriesPath), true);
        foreach ($countries as $country) {
            if (strcasecmp($country['name'], $countryName) === 0) {
                // Convert 3-letter ISO code (alpha-3) to 2-letter (alpha-2)
                // Most codes follow pattern: DZA -> DZ, FRA -> FR
                return substr($country['code'], 0, 2);
            }
        }

        return null;
    }

    /**
     * Get Algerian airports from local JSON file
     */
    private function getAlgerianAirports(): array
    {
        $airportsPath = public_path('algeria_airports.json');
        if (!file_exists($airportsPath)) {
            return [];
        }

        $airports = json_decode(file_get_contents($airportsPath), true);
        return $airports ?? [];
    }

    /**
     * Find nearest Algerian airport by city name
     */
    private function findAlgerianAirportByCity(string $cityName): ?array
    {
        $airports = $this->getAlgerianAirports();
        
        foreach ($airports as $airport) {
            if (strcasecmp($airport['city'], $cityName) === 0 || 
                (isset($airport['cityArabic']) && strcasecmp($airport['cityArabic'], $cityName) === 0)) {
                return $airport;
            }
        }

        return null;
    }

    /**
     * Find nearest Algerian airport by coordinates
     */
    private function findNearestAlgerianAirport(float $latitude, float $longitude): ?array
    {
        $airports = $this->getAlgerianAirports();
        $nearestAirport = null;
        $minDistance = PHP_FLOAT_MAX;

        foreach ($airports as $airport) {
            if (!isset($airport['geoCode']['latitude']) || !isset($airport['geoCode']['longitude'])) {
                continue;
            }

            $distance = $this->calculateDistance(
                $latitude,
                $longitude,
                $airport['geoCode']['latitude'],
                $airport['geoCode']['longitude']
            );

            if ($distance < $minDistance) {
                $minDistance = $distance;
                $nearestAirport = $airport;
            }
        }

        return $nearestAirport;
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     */
    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371; // kilometers

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Search for flights between two locations
     */
    public function searchFlights(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'origin' => 'required|string|size:3',
            'destination' => 'required|string|size:3',
            'departure_date' => 'required|date|after_or_equal:today',
            'adults' => 'required|integer|min:1|max:9',
            'return_date' => 'nullable|date|after:departure_date',
            'max' => 'nullable|integer|min:1|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $result = $this->amadeusService->searchFlights(
            strtoupper($request->origin),
            strtoupper($request->destination),
            $request->departure_date,
            $request->adults,
            $request->return_date,
            $request->max ?? 10
        );

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error']
            ], 500);
        }

        return response()->json($result['data']);
    }

    /**
     * Search for multi-city flights
     */
    public function searchMultiCityFlights(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'segments' => 'required|array|min:2',
            'segments.*.origin' => 'required|string|size:3',
            'segments.*.destination' => 'required|string|size:3',
            'segments.*.date' => 'required|date|after_or_equal:today',
            'adults' => 'required|integer|min:1|max:9',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Normalize IATA codes to uppercase
        $segments = array_map(function ($segment, $index) {
            return [
                'id' => $index + 1,
                'origin' => strtoupper($segment['origin']),
                'destination' => strtoupper($segment['destination']),
                'date' => $segment['date']
            ];
        }, $request->segments, array_keys($request->segments));

        $result = $this->amadeusService->searchMultiCityFlights(
            $segments,
            $request->adults
        );

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error']
            ], 500);
        }

        return response()->json($result['data']);
    }

    /**
     * Search airports by city name
     */
    public function searchAirportsByCity(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'city' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // First try to find in local Algerian airports
        $algerianAirport = $this->findAlgerianAirportByCity($request->city);
        if ($algerianAirport) {
            return response()->json(['data' => [$algerianAirport]]);
        }

        // Fall back to Amadeus API
        $result = $this->amadeusService->searchAirportsByCity($request->city);

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error']
            ], 500);
        }

        return response()->json($result['data']);
    }

    /**
     * Get all Algerian airports
     */
    public function getAlgerianAirportsEndpoint()
    {
        $airports = $this->getAlgerianAirports();
        
        return response()->json([
            'data' => $airports,
            'count' => count($airports)
        ]);
    }

    /**
     * Get nearest airport to coordinates
     */
    public function getNearestAirport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $result = $this->amadeusService->getNearestAirport(
            $request->latitude,
            $request->longitude
        );

        if (!$result['success']) {
            return response()->json([
                'error' => $result['error']
            ], 500);
        }

        return response()->json($result['data']);
    }

    /**
     * Get flight suggestions for custom tour destinations
     */
    public function getCustomTourFlights(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'destinations' => 'required|array|min:2',
            'destinations.*.city' => 'required|string',
            'destinations.*.country' => 'required|string',
            'destinations.*.latitude' => 'nullable|numeric',
            'destinations.*.longitude' => 'nullable|numeric',
            'start_date' => 'required|date|after_or_equal:today',
            'adults' => 'required|integer|min:1|max:9',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $destinations = $request->destinations;
        $startDate = $request->start_date;
        $adults = $request->adults;

        // Get unique countries
        $countries = array_unique(array_column($destinations, 'country'));
        
        // If all destinations are in the same country, no flights needed
        if (count($countries) === 1) {
            return response()->json([
                'flights' => [],
                'message' => 'All destinations are in the same country. No flights required.'
            ]);
        }

        $flights = [];
        $currentDate = \Carbon\Carbon::parse($startDate);

        // Find flights between destinations in different countries
        for ($i = 0; $i < count($destinations) - 1; $i++) {
            $current = $destinations[$i];
            $next = $destinations[$i + 1];

            // Convert country names to codes
            $currentCountryCode = $this->getCountryCode($current['country']);
            $nextCountryCode = $this->getCountryCode($next['country']);

            \Log::info('Country codes', [
                'current_country' => $current['country'],
                'current_code' => $currentCountryCode,
                'next_country' => $next['country'],
                'next_code' => $nextCountryCode
            ]);

            // Check if countries are different
            if ($currentCountryCode !== $nextCountryCode) {
                // Try to find airport from local Algeria airports first
                $originAirport = null;
                $destAirport = null;

                // For Algeria, try local airports first
                if ($currentCountryCode === 'DZ' || strcasecmp($current['country'], 'Algeria') === 0) {
                    $originAirport = $this->findAlgerianAirportByCity($current['city']);
                    if (!$originAirport && isset($current['latitude']) && isset($current['longitude'])) {
                        $originAirport = $this->findNearestAlgerianAirport($current['latitude'], $current['longitude']);
                    }
                }

                if ($nextCountryCode === 'DZ' || strcasecmp($next['country'], 'Algeria') === 0) {
                    $destAirport = $this->findAlgerianAirportByCity($next['city']);
                    if (!$destAirport && isset($next['latitude']) && isset($next['longitude'])) {
                        $destAirport = $this->findNearestAlgerianAirport($next['latitude'], $next['longitude']);
                    }
                }

                // If not found in local airports, fall back to Amadeus API
                if (!$originAirport) {
                    $originAirportResult = $this->amadeusService->searchAirportsByCity($current['city'], $currentCountryCode);
                    
                    \Log::info('Origin city search', [
                        'city' => $current['city'],
                        'countryCode' => $currentCountryCode,
                        'found' => count($originAirportResult['data'] ?? []),
                        'success' => $originAirportResult['success']
                    ]);
                    
                    // If no results by city and we have coordinates, try nearest airport
                    if ($originAirportResult['success'] && empty($originAirportResult['data']) && 
                        isset($current['latitude']) && isset($current['longitude'])) {
                        $originAirportResult = $this->amadeusService->getNearestAirport(
                            $current['latitude'],
                            $current['longitude'],
                            $currentCountryCode
                        );
                        \Log::info('Origin coordinate fallback', [
                            'lat' => $current['latitude'],
                            'lng' => $current['longitude'],
                            'countryCode' => $currentCountryCode,
                            'found' => !empty($originAirportResult['data']),
                            'airport' => $originAirportResult['data']['iataCode'] ?? 'none'
                        ]);
                        // Wrap single airport in array for consistency
                        if ($originAirportResult['success'] && !empty($originAirportResult['data'])) {
                            $originAirportResult['data'] = [$originAirportResult['data']];
                        }
                    }
                    
                    // Final fallback: try city name as IATA code (e.g., "Annaba" -> "AAE")
                    // Some airports aren't in location search but work in flight search
                    if ($originAirportResult['success'] && empty($originAirportResult['data'])) {
                        $cityCode = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $current['city']), 0, 3));
                        \Log::info('Origin city-as-IATA fallback', [
                            'city' => $current['city'],
                            'derived_code' => $cityCode
                        ]);
                        // Create a synthetic airport entry to try
                        $originAirportResult['data'] = [[
                            'iataCode' => $cityCode,
                            'name' => $current['city'],
                            'countryCode' => $currentCountryCode,
                            'address' => [
                                'cityName' => $current['city'],
                                'countryCode' => $currentCountryCode
                            ],
                            'geoCode' => [
                                'latitude' => $current['latitude'] ?? null,
                                'longitude' => $current['longitude'] ?? null
                            ]
                        ]];
                    }

                    if (isset($originAirportResult) && $originAirportResult['success'] && !empty($originAirportResult['data'])) {
                        $originAirport = $originAirportResult['data'][0];
                    }
                } else {
                    \Log::info('Using local Algerian airport for origin', [
                        'city' => $current['city'],
                        'airport' => $originAirport['iataCode']
                    ]);
                }
                
                if (!$destAirport) {
                    $destAirportResult = $this->amadeusService->searchAirportsByCity($next['city'], $nextCountryCode);
                    
                    // If no results by city and we have coordinates, try nearest airport
                    if ($destAirportResult['success'] && empty($destAirportResult['data']) && 
                        isset($next['latitude']) && isset($next['longitude'])) {
                        $destAirportResult = $this->amadeusService->getNearestAirport(
                            $next['latitude'],
                            $next['longitude'],
                            $nextCountryCode
                        );
                        // Wrap single airport in array for consistency
                        if ($destAirportResult['success'] && !empty($destAirportResult['data'])) {
                            $destAirportResult['data'] = [$destAirportResult['data']];
                        }
                    }
                    
                    // Final fallback: try city name as IATA code (e.g., "Annaba" -> "AAE")
                    if ($destAirportResult['success'] && empty($destAirportResult['data'])) {
                        $cityCode = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $next['city']), 0, 3));
                        \Log::info('Destination city-as-IATA fallback', [
                            'city' => $next['city'],
                            'derived_code' => $cityCode
                        ]);
                        $destAirportResult['data'] = [[
                            'iataCode' => $cityCode,
                            'name' => $next['city'],
                            'countryCode' => $nextCountryCode,
                            'address' => [
                                'cityName' => $next['city'],
                                'countryCode' => $nextCountryCode
                            ],
                            'geoCode' => [
                                'latitude' => $next['latitude'] ?? null,
                                'longitude' => $next['longitude'] ?? null
                            ]
                        ]];
                    }

                    if (isset($destAirportResult) && $destAirportResult['success'] && !empty($destAirportResult['data'])) {
                        $destAirport = $destAirportResult['data'][0];
                    }
                } else {
                    \Log::info('Using local Algerian airport for destination', [
                        'city' => $next['city'],
                        'airport' => $destAirport['iataCode']
                    ]);
                }

                \Log::info('Airport search results', [
                    'origin_city' => $current['city'],
                    'origin_airport' => $originAirport['iataCode'] ?? 'not found',
                    'dest_city' => $next['city'],
                    'dest_airport' => $destAirport['iataCode'] ?? 'not found'
                ]);

                if ($originAirport && $destAirport) {
                    // Normalize airport structure to ensure address field exists
                    if (!isset($originAirport['address'])) {
                        $originAirport['address'] = [
                            'cityName' => $originAirport['name'] ?? $current['city'],
                            'countryCode' => $originAirport['countryCode'] ?? $currentCountryCode
                        ];
                    }
                    if (!isset($destAirport['address'])) {
                        $destAirport['address'] = [
                            'cityName' => $destAirport['name'] ?? $next['city'],
                            'countryCode' => $destAirport['countryCode'] ?? $nextCountryCode
                        ];
                    }
                    
                    // Ensure geoCode exists
                    if (!isset($originAirport['geoCode'])) {
                        $originAirport['geoCode'] = [
                            'latitude' => $originAirport['latitude'] ?? $current['latitude'] ?? null,
                            'longitude' => $originAirport['longitude'] ?? $current['longitude'] ?? null
                        ];
                    }
                    if (!isset($destAirport['geoCode'])) {
                        $destAirport['geoCode'] = [
                            'latitude' => $destAirport['latitude'] ?? $next['latitude'] ?? null,
                            'longitude' => $destAirport['longitude'] ?? $next['longitude'] ?? null
                        ];
                    }

                    \Log::info('Searching flights', [
                        'origin' => $originAirport['iataCode'],
                        'dest' => $destAirport['iataCode'],
                        'date' => $currentDate->format('Y-m-d')
                    ]);

                    // Search for flights
                    $flightResult = $this->amadeusService->searchFlights(
                        $originAirport['iataCode'],
                        $destAirport['iataCode'],
                        $currentDate->format('Y-m-d'),
                        $adults,
                        null,
                        5
                    );

                    \Log::info('Flight search result', [
                        'success' => $flightResult['success'],
                        'count' => count($flightResult['data'] ?? [])
                    ]);

                    if ($flightResult['success'] && !empty($flightResult['data'])) {
                        // Log first flight offer structure
                        if (isset($flightResult['data'][0])) {
                            \Log::info('First flight offer structure', [
                                'keys' => array_keys($flightResult['data'][0]),
                                'has_itineraries' => isset($flightResult['data'][0]['itineraries']),
                                'sample' => json_encode($flightResult['data'][0], JSON_PARTIAL_OUTPUT_ON_ERROR)
                            ]);
                        }
                        
                        $flights[] = [
                            'segment_index' => $i,
                            'from_destination' => $current,
                            'to_destination' => $next,
                            'origin_airport' => $originAirport,
                            'destination_airport' => $destAirport,
                            'flight_offers' => $flightResult['data'],
                            'dictionaries' => []
                        ];
                    }
                }

                // Add 2 days for each destination
                $currentDate->addDays(2);
            }
        }

        return response()->json([
            'flights' => $flights,
            'total_segments' => count($flights)
        ]);
    }

    /**
     * Clear flight cache
     */
    public function clearCache()
    {
        $this->amadeusService->clearFlightCache();

        return response()->json([
            'message' => 'Flight cache cleared successfully'
        ]);
    }
}
