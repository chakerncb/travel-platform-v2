<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitRestaurantRequest;
use App\Models\Restaurant;
use App\Models\RestaurantUsersRole;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class RestaurantController extends Controller
{


    public function index(){
        $restaurant = Restaurant::all();
        if ($restaurant->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No restaurants found',
            ], 404);
        }
        return response()->json([
            'status' => true,
            'restaurants' => $restaurant,
            'message' => 'Restaurants retrieved successfully',
        ]);
    }

    public function submit(SubmitRestaurantRequest $request)
    {
        $user = Auth::user();
        $restaurant = new Restaurant();
        $restaurant->name = $request->name;
        $restaurant->address = $request->address;
        $restaurant->phone = $request->phone ?? $user->phone; 
        $restaurant->email = $request->email ?? $user->email;  
        $restaurant->description = $request->description;
        $restaurant->logo_path = $request->file('logo_path')->store('logos', 'public');
        $restaurant->is_active = false;
        $restaurant->save();

        try {
        $restaurantOwner = new RestaurantUsersRole();
        $restaurantOwner->restaurant_id = $restaurant->id;
        $restaurantOwner->user_id = $user->id;
        $restaurantOwner->restaurant_role_id = 1;
        $restaurantOwner->save();
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to assign restaurant owner: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status' => true,
            'user' => $user,
            'restaurant' => $restaurant,
            'message' => 'Restaurant submitted successfully',
        ]);
    }

}
