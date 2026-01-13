<?php

namespace App\Services;

use Amadeus\Amadeus;
use Amadeus\Exceptions\ResponseException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AmadeusService
{
    protected $amadeus;

    public function __construct()
    {
        $builder = Amadeus::builder(
            config('services.amadeus.api_key'),
            config('services.amadeus.api_secret')
        )->setLogLevel('silent');

        // Set production environment if configured
        if (config('services.amadeus.environment', 'test') === 'production') {
            $builder->setProductionEnvironment();
        }

        $this->amadeus = $builder->build();
    }

    /**
     * Search for flights between origin and destination
     * 
     * @param string $origin IATA code (e.g., 'JFK')
     * @param string $destination IATA code (e.g., 'LAX')
     * @param string $departureDate Format: YYYY-MM-DD
     * @param int $adults Number of adult passengers
     * @param string|null $returnDate Optional return date
     * @param int $max Maximum number of results (default 10)
     * @return array
     */
    public function searchFlights(
        string $origin,
        string $destination,
        string $departureDate,
        int $adults = 1,
        ?string $returnDate = null,
        int $max = 10
    ): array {
        $cacheKey = $this->getFlightCacheKey($origin, $destination, $departureDate, $adults, $returnDate, $max);
        
        return Cache::remember($cacheKey, 3600, function () use ($origin, $destination, $departureDate, $adults, $returnDate, $max) {
            try {
                $params = [
                    'originLocationCode' => $origin,
                    'destinationLocationCode' => $destination,
                    'departureDate' => $departureDate,
                    'adults' => $adults,
                    'max' => $max,
                    'currencyCode' => 'DZD', // Algerian Dinar
                ];

                if ($returnDate) {
                    $params['returnDate'] = $returnDate;
                }

                $flightOffers = $this->amadeus->getShopping()->getFlightOffers()->get($params);

                // Convert FlightOffer objects to arrays using the built-in toArray() method
                $offers = array_map(function ($offer) {
                    if (method_exists($offer, 'toArray')) {
                        return $offer->toArray();
                    }
                    return json_decode(json_encode($offer), true);
                }, $flightOffers);

                return [
                    'success' => true,
                    'data' => $offers,
                ];
            } catch (ResponseException $e) {
                Log::error('Amadeus API Error: ' . $e->getMessage(), [
                    'code' => $e->getCode()
                ]);

                return [
                    'success' => false,
                    'error' => 'Failed to fetch flights: ' . $e->getMessage(),
                    'data' => []
                ];
            } catch (\Exception $e) {
                Log::error('Amadeus Service Error: ' . $e->getMessage());

                return [
                    'success' => false,
                    'error' => 'An error occurred while searching for flights',
                    'data' => []
                ];
            }
        });
    }

    /**
     * Get airport information by IATA code
     * 
     * @param string $iataCode Airport IATA code
     * @return array
     */
    public function getAirportByIataCode(string $iataCode): array
    {
        $cacheKey = "airport_info_{$iataCode}";
        
        return Cache::remember($cacheKey, 86400, function () use ($iataCode) {
            try {
                $locations = $this->amadeus->getReferenceData()
                    ->getLocations()
                    ->getAirports()
                    ->get(['keyword' => $iataCode]);

                if (!empty($locations)) {
                    $location = $locations[0];
                    $geoCode = $location->getGeoCode();
                    
                    $airport = [
                        'id' => $location->getId(),
                        'type' => $location->getType(),
                        'subType' => $location->getSubType(),
                        'name' => $location->getName(),
                        'detailedName' => $location->getDetailedName(),
                        'iataCode' => $location->getIataCode(),
                        'geoCode' => $geoCode ? [
                            'latitude' => $geoCode->getLatitude(),
                            'longitude' => $geoCode->getLongitude()
                        ] : null,
                    ];

                    return [
                        'success' => true,
                        'data' => $airport,
                    ];
                }

                return [
                    'success' => false,
                    'error' => 'Airport not found',
                    'data' => []
                ];
            } catch (ResponseException $e) {
                Log::error('Amadeus Airport API Error: ' . $e->getMessage());

                return [
                    'success' => false,
                    'error' => 'Failed to fetch airport information',
                    'data' => []
                ];
            }
        });
    }

    /**
     * Search airports by city name
     * 
     * @param string $cityName City name
     * @return array
     */
    public function searchAirportsByCity(string $cityName, ?string $countryCode = null): array
    {
        $cacheKey = "airports_by_city_" . md5($cityName . ($countryCode ?? ''));
        
        return Cache::remember($cacheKey, 86400, function () use ($cityName, $countryCode) {
            try {
                $params = [
                    'keyword' => $cityName,
                    'subType' => 'AIRPORT'
                ];

                // Add countryCode parameter (2-letter ISO code) if provided
                if ($countryCode) {
                    $params['countryCode'] = $countryCode;
                }

                $locations = $this->amadeus->getReferenceData()
                    ->getLocations()
                    ->get($params);

                // Convert Location objects to arrays
                $airports = array_map(function ($location) {
                    $geoCode = $location->getGeoCode();
                    $address = $location->getAddress();
                    return [
                        'id' => $location->getId(),
                        'type' => $location->getType(),
                        'subType' => $location->getSubType(),
                        'name' => $location->getName(),
                        'detailedName' => $location->getDetailedName(),
                        'iataCode' => $location->getIataCode(),
                        'countryCode' => $address ? $address->getCountryCode() : null,
                        'geoCode' => $geoCode ? [
                            'latitude' => $geoCode->getLatitude(),
                            'longitude' => $geoCode->getLongitude()
                        ] : null,
                    ];
                }, $locations);

                return [
                    'success' => true,
                    'data' => $airports,
                ];
            } catch (ResponseException $e) {
                Log::error('Amadeus City Airport Search Error: ' . $e->getMessage());

                return [
                    'success' => false,
                    'error' => 'Failed to search airports',
                    'data' => []
                ];
            }
        });
    }

    /**
     * Search for multi-city flights
     * 
     * @param array $segments Array of flight segments with origin, destination, and date
     * @param int $adults Number of adults
     * @return array
     */
    public function searchMultiCityFlights(array $segments, int $adults = 1): array
    {
        $cacheKey = $this->getMultiCityFlightCacheKey($segments, $adults);
        
        return Cache::remember($cacheKey, 3600, function () use ($segments, $adults) {
            try {
                $originDestinations = array_map(function ($segment) {
                    return [
                        'id' => (string) ($segment['id'] ?? uniqid()),
                        'originLocationCode' => $segment['origin'],
                        'destinationLocationCode' => $segment['destination'],
                        'departureDateTimeRange' => [
                            'date' => $segment['date']
                        ]
                    ];
                }, $segments);

                $body = [
                    'originDestinations' => $originDestinations,
                    'travelers' => array_map(function ($i) {
                        return [
                            'id' => (string) ($i + 1),
                            'travelerType' => 'ADULT'
                        ];
                    }, range(0, $adults - 1)),
                    'sources' => ['GDS'],
                    'searchCriteria' => [
                        'maxFlightOffers' => 10,
                    ]
                ];

                $flightOffers = $this->amadeus->getShopping()
                    ->getFlightOffers()
                    ->post(json_encode($body));

                // Convert FlightOffer objects to arrays
                $offers = array_map(function ($offer) {
                    return json_decode(json_encode($offer), true);
                }, $flightOffers);

                return [
                    'success' => true,
                    'data' => $offers,
                ];
            } catch (ResponseException $e) {
                Log::error('Amadeus Multi-City API Error: ' . $e->getMessage());

                return [
                    'success' => false,
                    'error' => 'Failed to fetch multi-city flights: ' . $e->getMessage(),
                    'data' => []
                ];
            } catch (\Exception $e) {
                Log::error('Multi-City Service Error: ' . $e->getMessage());

                return [
                    'success' => false,
                    'error' => 'An error occurred while searching for flights',
                    'data' => []
                ];
            }
        });
    }

    /**
     * Get nearest airport to coordinates
     * 
     * @param float $latitude
     * @param float $longitude
     * @return array
     */
    public function getNearestAirport(float $latitude, float $longitude, ?string $countryCode = null): array
    {
        $cacheKey = "nearest_airport_{$latitude}_{$longitude}_" . ($countryCode ?? '');
        
        return Cache::remember($cacheKey, 86400, function () use ($latitude, $longitude, $countryCode) {
            try {
                $locations = $this->amadeus->getReferenceData()
                    ->getLocations()
                    ->getAirports()
                    ->get([
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                        'radius' => 500,
                        'sort' => 'distance'
                    ]);

                // Filter by country code if provided, otherwise take first
                if (!empty($locations)) {
                    $location = null;
                    
                    if ($countryCode) {
                        // Find first airport matching country code
                        foreach ($locations as $loc) {
                            $address = $loc->getAddress();
                            if ($address && $address->getCountryCode() === $countryCode) {
                                $location = $loc;
                                break;
                            }
                        }
                        // If country code was specified but no match found, return empty
                        if (!$location) {
                            return [
                                'success' => true,
                                'data' => [],
                            ];
                        }
                    } else {
                        // No country code filter, use nearest
                        $location = $locations[0];
                    }
                    $geoCode = $location->getGeoCode();
                    $distance = $location->getDistance();
                    $address = $location->getAddress();
                    
                    $airport = [
                        'id' => $location->getId(),
                        'type' => $location->getType(),
                        'subType' => $location->getSubType(),
                        'name' => $location->getName(),
                        'detailedName' => $location->getDetailedName(),
                        'iataCode' => $location->getIataCode(),
                        'countryCode' => $address ? $address->getCountryCode() : null,
                        'geoCode' => $geoCode ? [
                            'latitude' => $geoCode->getLatitude(),
                            'longitude' => $geoCode->getLongitude()
                        ] : null,
                        'distance' => $distance ? [
                            'value' => $distance->getValue(),
                            'unit' => $distance->getUnit()
                        ] : null,
                    ];

                    return [
                        'success' => true,
                        'data' => $airport,
                    ];
                }

                return [
                    'success' => false,
                    'error' => 'No airports found',
                    'data' => []
                ];
            } catch (ResponseException $e) {
                Log::error('Amadeus Nearest Airport Error: ' . $e->getMessage());

                return [
                    'success' => false,
                    'error' => 'Failed to find nearest airport',
                    'data' => []
                ];
            }
        });
    }

    /**
     * Clear flight cache
     */
    public function clearFlightCache(): void
    {
        Cache::flush();
    }

    /**
     * Generate cache key for flight search
     */
    private function getFlightCacheKey(
        string $origin,
        string $destination,
        string $departureDate,
        int $adults,
        ?string $returnDate,
        int $max
    ): string {
        return sprintf(
            'flights_%s_%s_%s_%d_%s_%d',
            $origin,
            $destination,
            $departureDate,
            $adults,
            $returnDate ?? 'oneway',
            $max
        );
    }

    /**
     * Generate cache key for multi-city flight search
     */
    private function getMultiCityFlightCacheKey(array $segments, int $adults): string
    {
        $segmentKey = md5(json_encode($segments));
        return "multi_city_flights_{$segmentKey}_{$adults}";
    }
}
