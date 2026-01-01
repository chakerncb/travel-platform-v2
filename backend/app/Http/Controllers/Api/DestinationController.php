<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DestinationResource;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Destination::with(['images', 'primaryImage']);

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

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $destinations = $query->paginate($perPage);

        return DestinationResource::collection($destinations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $destination = Destination::create($validated);

        return new DestinationResource($destination->load(['images', 'primaryImage']));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $destination = Destination::with(['images', 'primaryImage'])->findOrFail($id);

        return new DestinationResource($destination);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $destination = Destination::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'description' => 'sometimes|string',
            'short_description' => 'nullable|string|max:500',
            'city' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:255',
            'is_active' => 'boolean',
        ]);

        $destination->update($validated);

        return new DestinationResource($destination->load(['images', 'primaryImage']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();

        return response()->json(['message' => 'Destination deleted successfully'], Response::HTTP_OK);
    }
}
