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

// Email verification (public - no auth required)
Route::get('/email/verify/{id}/{hash}', 'App\Http\Controllers\AuthController@EmailVerification')->name('verification.verify');
Route::get('/account/ConfirmEmail', 'App\Http\Controllers\AuthController@confirmEmail')->name('verification.confirm');

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('logout', 'App\Http\Controllers\AuthController@logout');
    Route::get('profile', 'App\Http\Controllers\AuthController@profile');
    Route::post('/email/resend', 'App\Http\Controllers\AuthController@resendVerificationEmail')->name('verification.send');
    Route::get('/email/verification-notice', 'App\Http\Controllers\AuthController@verificationNotice')->name('verification.notice');
});

// Unsplash API routes
Route::prefix('unsplash')->group(function () {
    Route::get('/search', [App\Http\Controllers\UnsplashController::class, 'search']);
    Route::post('/download', [App\Http\Controllers\UnsplashController::class, 'download']);
});

// Public API routes (no authentication required)
Route::prefix('v1')->group(function () {
    // Destinations
    Route::apiResource('destinations', App\Http\Controllers\Api\DestinationController::class);
    
    // Hotels
    Route::apiResource('hotels', App\Http\Controllers\Api\HotelController::class);
    
    // Tours
    Route::apiResource('tours', App\Http\Controllers\Api\TourController::class);
    
    // Custom Tour Bookings (public submission)
    Route::post('custom-tour-bookings', [App\Http\Controllers\Api\CustomTourBookingController::class, 'store']);
    Route::get('custom-tour-bookings', [App\Http\Controllers\Api\CustomTourBookingController::class, 'index']);
    Route::get('custom-tour-bookings/{id}', [App\Http\Controllers\Api\CustomTourBookingController::class, 'show']);
    Route::post('custom-tour-bookings/{id}/confirm', [App\Http\Controllers\Api\CustomTourBookingController::class, 'userConfirm']);
    
    // Admin routes for custom tour bookings (should be protected in production)
    Route::post('custom-tour-bookings/{id}/admin-proposal', [App\Http\Controllers\Api\CustomTourBookingController::class, 'adminProposal']);
    Route::post('custom-tour-bookings/{id}/reject', [App\Http\Controllers\Api\CustomTourBookingController::class, 'reject']);
    Route::post('custom-tour-bookings/{id}/payment', [App\Http\Controllers\Api\CustomTourBookingController::class, 'updatePayment']);

    // Flight routes
    Route::prefix('flights')->group(function () {
        Route::get('/search', [App\Http\Controllers\Api\FlightController::class, 'searchFlights']);
        Route::post('/search-multi-city', [App\Http\Controllers\Api\FlightController::class, 'searchMultiCityFlights']);
        Route::get('/airports/search', [App\Http\Controllers\Api\FlightController::class, 'searchAirportsByCity']);
        Route::get('/airports/nearest', [App\Http\Controllers\Api\FlightController::class, 'getNearestAirport']);
        Route::get('/airports/algeria', [App\Http\Controllers\Api\FlightController::class, 'getAlgerianAirportsEndpoint']);
        Route::post('/custom-tour', [App\Http\Controllers\Api\FlightController::class, 'getCustomTourFlights']);
        Route::post('/clear-cache', [App\Http\Controllers\Api\FlightController::class, 'clearCache']);
    });
});

// Bookings routes (some public, some protected)
Route::prefix('bookings')->group(function () {
    // Public routes
    Route::post('/', [App\Http\Controllers\BookingController::class, 'store']);
    Route::get('/reference/{reference}', [App\Http\Controllers\BookingController::class, 'getByReference']);
    Route::get('/tours/{tourId}/availability', [App\Http\Controllers\BookingController::class, 'getTourAvailability']);
    Route::get('/tours/{tourId}/check-user-booking', [App\Http\Controllers\BookingController::class, 'checkUserBooking']);
    Route::get('/verify-payment', [App\Http\Controllers\BookingController::class, 'verifyPayment']);
    
    // Protected routes (require authentication)
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/', [App\Http\Controllers\BookingController::class, 'index']);
        Route::get('/{id}', [App\Http\Controllers\BookingController::class, 'show']);
        Route::put('/{id}', [App\Http\Controllers\BookingController::class, 'update']);
        Route::post('/{id}/cancel', [App\Http\Controllers\BookingController::class, 'cancel']);
        Route::post('/{id}/confirm', [App\Http\Controllers\BookingController::class, 'confirm']);
        Route::delete('/{id}', [App\Http\Controllers\BookingController::class, 'destroy']);
    });
});

// Webhook routes (public - authenticated by signature)
Route::post('/webhooks/chargily', [App\Http\Controllers\ChargilyWebhookController::class, 'handle']);

// Protected API routes (requires authentication)
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    // Wishlist routes
    Route::prefix('wishlist')->group(function () {
        Route::get('/', [App\Http\Controllers\WishlistController::class, 'index']);
        Route::post('/', [App\Http\Controllers\WishlistController::class, 'store']);
        Route::delete('/{id}', [App\Http\Controllers\WishlistController::class, 'destroy']);
        Route::delete('/remove/item', [App\Http\Controllers\WishlistController::class, 'removeByTypeAndId']);
        Route::get('/check', [App\Http\Controllers\WishlistController::class, 'check']);
    });

    // User tours routes
    Route::prefix('user/tours')->group(function () {
        Route::get('/', [App\Http\Controllers\UserTourController::class, 'index']);
        Route::get('/upcoming', [App\Http\Controllers\UserTourController::class, 'upcoming']);
        Route::get('/past', [App\Http\Controllers\UserTourController::class, 'past']);
    });
});



