<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;

Route::get('/test-cache', function () {
    $cacheKey = 'test_cache_key';
    
    // Test 1: Check current cache driver
    $driver = config('cache.default');
    
    // Test 2: Store a value
    Cache::put($cacheKey, [
        'message' => 'Hello from cache!',
        'timestamp' => now()->toDateTimeString(),
        'driver' => $driver,
    ], 60);
    
    // Test 3: Retrieve the value
    $cached = Cache::get($cacheKey);
    
    // Test 4: Check if cache is working
    $isWorking = $cached !== null;
    
    // Test 5: Get cache statistics (if Redis)
    $stats = null;
    if ($driver === 'redis') {
        try {
            $redis = Cache::getRedis();
            $info = $redis->connection()->info();
            $stats = [
                'redis_version' => $info['redis_version'] ?? 'N/A',
                'connected_clients' => $info['connected_clients'] ?? 'N/A',
                'used_memory_human' => $info['used_memory_human'] ?? 'N/A',
                'total_commands' => $info['total_commands_processed'] ?? 'N/A',
            ];
        } catch (\Exception $e) {
            $stats = ['error' => $e->getMessage()];
        }
    }
    
    // Test 6: Test Cache::remember
    $rememberTest = Cache::remember('test_remember_' . time(), 60, function () {
        return [
            'computed_at' => now()->toDateTimeString(),
            'value' => rand(1000, 9999),
        ];
    });
    
    return response()->json([
        'status' => $isWorking ? 'Cache is working!' : 'Cache is NOT working!',
        'current_driver' => $driver,
        'cached_data' => $cached,
        'remember_test' => $rememberTest,
        'redis_stats' => $stats,
        'cache_keys_count' => $driver === 'redis' ? Cache::getRedis()->connection()->dbSize() : 'N/A',
    ]);
});

Route::get('/test-cache-clear', function () {
    Cache::flush();
    return response()->json([
        'message' => 'Cache cleared successfully!',
        'driver' => config('cache.default'),
    ]);
});
