<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

Route::get('/', function () {
    return redirect("/admin");
});

// Email verification redirect
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    // Call the API endpoint
    $response = Http::get(url("/api/email/verify/{$id}/{$hash}"));
    $data = $response->json();
    
    return view('email-verified', ['data' => $data]);
})->name('verification.verify.web');

// Unsplash picker route
Route::get('/unsplash-picker', function () {
    return view('unsplash-picker');
})->name('unsplash.picker');
