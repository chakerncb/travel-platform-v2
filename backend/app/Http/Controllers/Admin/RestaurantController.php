<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitRestaurantRequest;
use App\Models\Restaurant;
use App\Models\RestaurantUsersRole;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $restaurants = Restaurant::all();

        if ($restaurants->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No restaurants found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'restaurants' => $restaurants,
            'message' => 'Restaurants retrieved successfully',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SubmitRestaurantRequest $request)
    {
        $user = User::find($request->userId);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found',
            ], 404);
        }

        else if ($user->isOwner()){
            return response()->json([
                'status' => false,
                'message' => 'User is already an owner of a restaurant',
            ], 400);
        }

        //
        $restaurant = new Restaurant();
        $restaurant->name = $request->name;
        $restaurant->address = $request->address;
        $restaurant->phone = $request->phone;
        $restaurant->email = $request->email;
        $restaurant->description = $request->description;
        $restaurant->logo_path = $request->file('logo_path')->store('logos', 'public');
        $restaurant->is_active = $request->is_active ?? false;
        $restaurant->save();

        try {
        $restaurantOwner = new RestaurantUsersRole();
        $restaurantOwner->restaurant_id = $restaurant->id;
        $restaurantOwner->user_id = $request->userId;
        $restaurantOwner->restaurant_role_id = 1;
        $restaurantOwner->save();

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to assign restaurant owner: ' . $e->getMessage(),
            ], 500);
        }


        if (!$restaurant) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to create restaurant',
            ], 500);
        }

        return response()->json([
            'status' => true,
            'restaurant' => $restaurant,
            'message' => 'Restaurant created successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $restaurant = Restaurant::find($id);

        if (!$restaurant) {
            return response()->json([
                'status' => false,
                'message' => 'Restaurant not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'restaurant' => $restaurant,
            'message' => 'Restaurant retrieved successfully',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $restaurant = Restaurant::find($id);

        if (!$restaurant) {
            return response()->json([
                'status' => false,
                'message' => 'Restaurant not found',
            ], 404);
        }

        try {
           
            $restaurant->update([
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone,
                'email' => $request->email,
                'description' => $request->description,
                'is_active' => $request->is_active,
            ]);

            if ($request->userId) {
            
            $user = User::find($request->userId);

                if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found',
                ], 404);
                }

                if ($user->isOwner()){
                    return response()->json([
                        'status' => false,
                        'message' => 'User is already an owner of a restaurant',
                    ], 400);

                } else if ($user->isOwnerOf($restaurant->id)) {
                    return response()->json([
                        'status' => false,
                        'message' => 'User is already an owner of this restaurant',
                    ], 400);
                }

                
            $restaurantRole = RestaurantUsersRole::where('restaurant_id', $restaurant->id)
                ->where('restaurant_role_id', 1)
                ->first();

            $restaurantRole = new RestaurantUsersRole();
            $restaurantRole->restaurant_id = $restaurant->id;
            $restaurantRole->user_id = $request->userId;
            $restaurantRole->restaurant_role_id = 1; // Assuming 1 is the ID for the Owner role
            $restaurantRole->save();
            $restaurantRole->save();
            }

            if ($request->hasFile('logo_path')) {
                if ($restaurant->logo_path) {
                    Storage::disk('public')->delete($restaurant->logo_path);
                }
                $restaurant->logo_path = $request->file('logo_path')->store('logos', 'public');
            }

            $restaurant->save();

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update restaurant: ' . $e->getMessage(),
            ], 500);
        }
        return response()->json([
            'status' => true,
            'restaurant' => $restaurant,
            'message' => 'Restaurant updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $restaurant = Restaurant::find($id);
        if (!$restaurant) {
            return response()->json([
                'status' => false,
                'message' => 'Restaurant not found',
            ], 404);
        }

        $restaurant->logo_path && Storage::disk('public')->delete($restaurant->logo_path);
        

        try{
         $restaurant->delete();
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete restaurant: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status' => true,
            'message' => 'Restaurant deleted successfully',
        ]);
    }

    public function updateStatus(Request $request, string $restaurantId)
    {
        $resturant = Restaurant::find($restaurantId);
        if (!$resturant) {
            return response()->json([
                'status' => false,
                'message' => 'Restaurant not found',
            ], 404);
        }

        $resturant->is_active = $request->is_active;            

        try {
            $resturant->save();
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update restaurant status: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status' => true,
            'restaurant' => $resturant,
            'message' => 'Restaurant status updated successfully',
        ]);

    }
}
