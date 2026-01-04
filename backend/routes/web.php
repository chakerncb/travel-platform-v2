<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect("/admin");
});
// Unsplash picker route
Route::get('/unsplash-picker', function () {
    return view('unsplash-picker');
})->name('unsplash.picker');
