<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Tour;
use App\Models\Destination;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    /**
     * Get all wishlist items for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $wishlists = Wishlist::where('user_id', $user->id)
            ->with('wishlistable')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($wishlist) {
                $item = $wishlist->wishlistable;
                
                if (!$item) {
                    return null;
                }

                return [
                    'id' => $wishlist->id,
                    'type' => class_basename($wishlist->wishlistable_type),
                    'item' => $this->formatWishlistItem($item, $wishlist->wishlistable_type),
                    'added_at' => $wishlist->created_at,
                ];
            })
            ->filter();

        return response()->json([
            'status' => true,
            'data' => $wishlists,
        ]);
    }

    /**
     * Add an item to the wishlist.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:Tour,Destination,Hotel',
            'id' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $type = 'App\\Models\\' . $request->type;
        $itemId = $request->id;

        // Check if item exists
        $item = $type::find($itemId);
        if (!$item) {
            return response()->json([
                'status' => false,
                'message' => 'Item not found',
            ], 404);
        }

        // Check if already in wishlist
        $exists = Wishlist::where('user_id', $user->id)
            ->where('wishlistable_type', $type)
            ->where('wishlistable_id', $itemId)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'Item already in wishlist',
            ], 409);
        }

        // Add to wishlist
        $wishlist = Wishlist::create([
            'user_id' => $user->id,
            'wishlistable_type' => $type,
            'wishlistable_id' => $itemId,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Item added to wishlist',
            'data' => [
                'id' => $wishlist->id,
                'type' => $request->type,
                'item' => $this->formatWishlistItem($item, $type),
                'added_at' => $wishlist->created_at,
            ],
        ], 201);
    }

    /**
     * Remove an item from the wishlist.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'status' => false,
                'message' => 'Wishlist item not found',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'status' => true,
            'message' => 'Item removed from wishlist',
        ]);
    }

    /**
     * Remove an item by type and ID.
     */
    public function removeByTypeAndId(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:Tour,Destination,Hotel',
            'id' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $type = 'App\\Models\\' . $request->type;
        $itemId = $request->id;

        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('wishlistable_type', $type)
            ->where('wishlistable_id', $itemId)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'status' => false,
                'message' => 'Item not in wishlist',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'status' => true,
            'message' => 'Item removed from wishlist',
        ]);
    }

    /**
     * Check if an item is in the wishlist.
     */
    public function check(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:Tour,Destination,Hotel',
            'id' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $type = 'App\\Models\\' . $request->type;
        $itemId = $request->id;

        $inWishlist = Wishlist::where('user_id', $user->id)
            ->where('wishlistable_type', $type)
            ->where('wishlistable_id', $itemId)
            ->exists();

        return response()->json([
            'status' => true,
            'in_wishlist' => $inWishlist,
        ]);
    }

    /**
     * Format wishlist item based on type.
     */
    private function formatWishlistItem($item, $type)
    {
        switch ($type) {
            case 'App\\Models\\Tour':
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'short_description' => $item->short_description,
                    'price' => $item->price,
                    'duration_days' => $item->duration_days,
                    'difficulty_level' => $item->difficulty_level,
                    'start_date' => $item->start_date,
                    'end_date' => $item->end_date,
                    'is_eco_friendly' => $item->is_eco_friendly,
                ];

            case 'App\\Models\\Destination':
                $item->load('primaryImage');
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'city' => $item->city,
                    'country' => $item->country,
                    'short_description' => $item->short_description,
                    'primary_image' => $item->primaryImage,
                ];

            case 'App\\Models\\Hotel':
                $item->load('primaryImage');
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'city' => $item->city,
                    'country' => $item->country,
                    'star_rating' => $item->star_rating,
                    'price_per_night' => $item->price_per_night,
                    'primary_image' => $item->primaryImage,
                ];

            default:
                return $item;
        }
    }
}
