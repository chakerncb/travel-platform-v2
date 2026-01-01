<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantBrowseController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $restaurants = Restaurant::all();

        if(!$restaurants){
            return response()->json([
                "status"=> "false",
                "message"=> "no restaurnat founded",
            ]);
        }

        $restaurantImages = $restaurants->images()->get();

        return response()->json([
            "status"=> "true",
            "message"=> "restaurants restreived succefully",
            "restaurants"=> $restaurants,
            "restaurantImages"=> $restaurantImages
        ]);

    }

    /**
     * Display the specified resource.
     */
    public function show(int $restaurantId)
    {
        //
        $restaurant = Restaurant::find($restaurantId);
        if(!$restaurant){
            return response()->json([
                "status"=> "false",
                "message"=> "restaurant not found",    
            ]);
        }

        $restaurantImages = $restaurant->images()->get();

        return response()->json([
            "status"=> "true",
            "message"=> "restaurant retreived succefully",
            "restaurant"=> $restaurant,
            "restaurantImages"=> $restaurantImages
        ]);
    }

    /**
     * Display restaurant Menu
     */
    public function getMenu(int $restaurantId)
    {
        $restaurant = Restaurant::find( $restaurantId );
        if(!$restaurant){
            return response()->json([
                "status"=> "false",
                "message"=> "restaurant not found",
            ]);
        }

        $menuItems = $restaurant->menuItems()->get();
        if($menuItems->isEmpty()){
            return response()->json([
                "status"=> "false",
                "message"=> "there is no menu item"
            ]);
        }

        return response()->json([
            "status"=> "true",
            "message"=> "menu items retreived succefully",
            "menuItems"=> $menuItems,
        ]);
    } 
}
