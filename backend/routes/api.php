<?php

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Authentication routes

Route::post('register', 'App\Http\Controllers\AuthController@register');
Route::post('login', 'App\Http\Controllers\AuthController@login');
Route::get('login', function (Request $request) {
    return response()->json([
        'status' => false,
        'message' => 'please login to access this functionality',
    ]);
})->name('login');

Route::group(['middleware' => ['auth:sanctum' , 'verified']], function () {
    Route::post('logout', 'App\Http\Controllers\AuthController@logout');
    Route::get('profile', 'App\Http\Controllers\AuthController@profile');
});

Route::get('/email/verify/{id}/{hash}', 'App\Http\Controllers\AuthController@EmailVerification')->middleware(['signed'])->name('verification.verify');

Route::post('/email/resend', 'App\Http\Controllers\AuthController@resendVerificationEmail')->middleware(['auth:sanctum'])->name('verification.send');

// Public API routes (no authentication required)
Route::prefix('v1')->group(function () {
    // Destinations
    Route::apiResource('destinations', App\Http\Controllers\Api\DestinationController::class);
    
    // Hotels
    Route::apiResource('hotels', App\Http\Controllers\Api\HotelController::class);
    
    // Tours
    Route::apiResource('tours', App\Http\Controllers\Api\TourController::class);
});

// Protected API routes (requires authentication)
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    // Add authenticated routes here
    // Example: Route::post('tours/{tour}/book', [TourController::class, 'book']);
});

// verification notice
Route::get('/email/verification-notice', 'App\Http\Controllers\AuthController@verificationNotice')->middleware(['auth:sanctum'])->name('verification.notice');



