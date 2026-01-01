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

// verification notice
Route::get('/email/verification-notice', 'App\Http\Controllers\AuthController@verificationNotice')->middleware(['auth:sanctum'])->name('verification.notice');



// create a new restaurant
Route::prefix('restaurants')->namespace('App\Http\Controllers')->group(function () {

    Route::get('/','RestaurantController@index');
    Route::post('/submit', 'RestaurantController@submit')->middleware(['auth:sanctum', 'verified']);
    
});


// Admin routes
Route::prefix('admin')->namespace('App\Http\Controllers\Admin')->middleware(['auth:sanctum', 'verified' , 'check.admin' ])->group(function () {

    Route::apiResource('restaurant', 'RestaurantController');
    Route::put('restaurant/{restaurantId}/status', 'RestaurantController@updateStatus');
    Route::apiResource('users','UsersController');

});

// Owner routes
Route::prefix('owner/{restaurantId}')->namespace('App\Http\Controllers\Owner')->middleware(['auth:sanctum', 'verified' , 'check.owner' ])->group(function () {

    Route::get('menu/categories', 'MenuCategoryController@index');
    Route::post('menu/categories', 'MenuCategoryController@store');
    Route::get('menu/categories/{categoryId}', 'MenuCategoryController@show');
    Route::put('menu/categories/{categoryId}', 'MenuCategoryController@update');
    Route::delete('menu/categories/{categoryId}', 'MenuCategoryController@destroy');

    Route::apiResource('menu/menu-items', controller: 'MenuItemController');
    Route::apiResource('/tables', 'TablesController');
    Route::apiResource('/staff' , 'StaffController');
});


//costumer rotes
Route::prefix('/public')->namespace('App\Http\Controllers\Customer')->group(function () {

    Route::get('/restaurants','RestaurantBrowseController@index');
    Route::get('/restaurants/{restaurantId}','RestaurantBrowseController@show');
    Route::get('/restaurant/{restaurantId}/menu','RestaurantBrowseController@getMenu');
    Route::get('/menu-items/{itemId}', 'MenuItemsController@show');
    Route::get('/menu-items/search/{itemName}', 'MenuItemsController@searchItem');

    Route::post('/checkout', 'CheckoutController@checkout')->middleware('auth:sanctum');


    
});


