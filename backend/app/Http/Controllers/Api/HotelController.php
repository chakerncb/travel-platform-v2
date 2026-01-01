<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HotelResource;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Hotel::with(['images', 'primaryImage', 'specifications']);

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        // Filter by country
        if ($request->filled('country')) {
            $query->where('country', $request->country);
        }

        // Filter by city
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        // Filter by star rating
        if ($request->filled('star_rating')) {
            $query->where('star_rating', $request->star_rating);
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price_per_night', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $hotels = $query->paginate($perPage);

        return HotelResource::collection($hotels);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'star_rating' => 'nullable|integer|min:1|max:5',
            'price_per_night' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $hotel = Hotel::create($validated);

        return new HotelResource($hotel->load(['images', 'primaryImage', 'specifications']));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $hotel = Hotel::with(['images', 'primaryImage', 'specifications'])->findOrFail($id);

        return new HotelResource($hotel);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $hotel = Hotel::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'city' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:255',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'star_rating' => 'nullable|integer|min:1|max:5',
            'price_per_night' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $hotel->update($validated);

        return new HotelResource($hotel->load(['images', 'primaryImage', 'specifications']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->delete();

        return response()->json(['message' => 'Hotel deleted successfully'], Response::HTTP_OK);
    }
}
