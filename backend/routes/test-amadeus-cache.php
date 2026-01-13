<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use App\Services\AmadeusService;

Route::get('/test-amadeus-cache', function () {
    $amadeusService = app(AmadeusService::class);
    
    $start = microtime(true);
    
    // Test with a simple flight search (will hit cache or API)
    $searchParams = [
        'originLocationCode' => 'ALG',
        'destinationLocationCode' => 'PAR',
        'departureDate' => now()->addDays(30)->format('Y-m-d'),
        'adults' => 1,
        'max' => 5
    ];
    
    try {
        $flights = $amadeusService->searchFlights($searchParams);
        $firstCallTime = (microtime(true) - $start) * 1000;
        
        // Second call (should be cached)
        $start = microtime(true);
        $flightsCached = $amadeusService->searchFlights($searchParams);
        $secondCallTime = (microtime(true) - $start) * 1000;
        
        return response()->json([
            'status' => 'success',
            'first_call_ms' => round($firstCallTime, 2),
            'second_call_ms' => round($secondCallTime, 2),
            'performance_improvement' => round(($firstCallTime / $secondCallTime), 2) . 'x faster',
            'flight_count' => count($flights),
            'cache_working' => $secondCallTime < $firstCallTime,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'note' => 'This might fail if Amadeus API credentials are not configured'
        ]);
    }
});
