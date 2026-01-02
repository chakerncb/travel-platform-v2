<?php

use Illuminate\Support\Facades\Route;

Route::get('/', 'App\Http\Controllers\HomeController@index');

// Unsplash picker route
Route::get('/unsplash-picker', function () {
    return view('unsplash-picker');
})->name('unsplash.picker');
