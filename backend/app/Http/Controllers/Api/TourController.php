<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TourResource;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TourController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Tour::with(['destinations', 'hotels'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating');

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by difficulty
        if ($request->filled('difficulty')) {
            $query->where('difficulty_level', $request->difficulty);
        }

        // Filter by eco-friendly
        if ($request->has('eco_friendly')) {
            $query->where('is_eco_friendly', $request->boolean('eco_friendly'));
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by duration
        if ($request->filled('min_duration')) {
            $query->where('duration_days', '>=', $request->min_duration);
        }
        if ($request->filled('max_duration')) {
            $query->where('duration_days', '<=', $request->max_duration);
        }

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $tours = $query->paginate($perPage);

        return TourResource::collection($tours);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:pre_prepared,custom',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'max_group_size' => 'nullable|integer|min:1',
            'difficulty_level' => 'required|in:easy,moderate,challenging,difficult',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'boolean',
            'is_eco_friendly' => 'boolean',
            'included_services' => 'nullable|array',
            'excluded_services' => 'nullable|array',
            'destinations' => 'nullable|array',
            'destinations.*.destination_id' => 'required|exists:destinations,id',
            'destinations.*.days_at_destination' => 'required|integer|min:1',
            'destinations.*.order' => 'nullable|integer',
            'hotels' => 'nullable|array',
            'hotels.*.hotel_id' => 'required|exists:hotels,id',
            'hotels.*.nights' => 'required|integer|min:1',
            'hotels.*.order' => 'nullable|integer',
        ]);

        $tour = Tour::create([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'short_description' => $validated['short_description'] ?? null,
            'price' => $validated['price'],
            'duration_days' => $validated['duration_days'],
            'max_group_size' => $validated['max_group_size'] ?? null,
            'difficulty_level' => $validated['difficulty_level'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'is_eco_friendly' => $validated['is_eco_friendly'] ?? true,
            'included_services' => $validated['included_services'] ?? null,
            'excluded_services' => $validated['excluded_services'] ?? null,
        ]);

        // Attach destinations
        if (isset($validated['destinations'])) {
            foreach ($validated['destinations'] as $destination) {
                $tour->destinations()->attach($destination['destination_id'], [
                    'days_at_destination' => $destination['days_at_destination'],
                    'order' => $destination['order'] ?? 0,
                ]);
            }
        }

        // Attach hotels
        if (isset($validated['hotels'])) {
            foreach ($validated['hotels'] as $hotel) {
                $tour->hotels()->attach($hotel['hotel_id'], [
                    'nights' => $hotel['nights'],
                    'order' => $hotel['order'] ?? 0,
                ]);
            }
        }

        return new TourResource($tour->load(['destinations', 'hotels']));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tour = Tour::with(['destinations', 'hotels'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->findOrFail($id);

        return new TourResource($tour);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $tour = Tour::findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|in:pre_prepared,custom',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'sometimes|numeric|min:0',
            'duration_days' => 'sometimes|integer|min:1',
            'max_group_size' => 'nullable|integer|min:1',
            'difficulty_level' => 'sometimes|in:easy,moderate,challenging,difficult',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'boolean',
            'is_eco_friendly' => 'boolean',
            'included_services' => 'nullable|array',
            'excluded_services' => 'nullable|array',
            'destinations' => 'nullable|array',
            'destinations.*.destination_id' => 'required|exists:destinations,id',
            'destinations.*.days_at_destination' => 'required|integer|min:1',
            'destinations.*.order' => 'nullable|integer',
            'hotels' => 'nullable|array',
            'hotels.*.hotel_id' => 'required|exists:hotels,id',
            'hotels.*.nights' => 'required|integer|min:1',
            'hotels.*.order' => 'nullable|integer',
        ]);

        $tour->update($validated);

        // Update destinations if provided
        if (isset($validated['destinations'])) {
            $tour->destinations()->detach();
            foreach ($validated['destinations'] as $destination) {
                $tour->destinations()->attach($destination['destination_id'], [
                    'days_at_destination' => $destination['days_at_destination'],
                    'order' => $destination['order'] ?? 0,
                ]);
            }
        }

        // Update hotels if provided
        if (isset($validated['hotels'])) {
            $tour->hotels()->detach();
            foreach ($validated['hotels'] as $hotel) {
                $tour->hotels()->attach($hotel['hotel_id'], [
                    'nights' => $hotel['nights'],
                    'order' => $hotel['order'] ?? 0,
                ]);
            }
        }

        return new TourResource($tour->load(['destinations', 'hotels']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tour = Tour::findOrFail($id);
        $tour->delete();

        return response()->json(['message' => 'Tour deleted successfully'], Response::HTTP_OK);
    }
}
