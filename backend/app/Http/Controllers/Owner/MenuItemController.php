<?php 

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Restaurant;
use \Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $restaurantId)
    {
        //
        $restaurant = Restaurant::find($restaurantId);
        if(!$restaurant){
            return response()->json([
                'status' => false,
                'message' => 'Restaurant not found',
            ], 404);
        }

        $menuItems = MenuItem::where("restaurant_id", $restaurant->id)->get();
        if ($menuItems->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No menu items found for this restaurant',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'menu_items' => $menuItems,
            'message' => 'Menu items retrieved successfully',
        ], 200);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        try {

            $messages = [
                'name.required' => 'The name field is required.',
                'name.string' => 'The name must be a string.',
                'name.max' => 'The name may not be greater than 255 characters.',
                'description.string' => 'The description must be a string.',
                'description.max' => 'The description may not be greater than 1000 characters.',
                'price.required' => 'The price field is required.',
                'price.numeric' => 'The price must be a number.',
                'price.min' => 'The price must be at least 0.',
                'menu_category_id.required' => 'The menu category ID is required.',
                'menu_category_id.exists' => 'The selected menu category does not exist.',
                'restaurant_id.required' => 'The restaurant ID is required.',
                'restaurant_id.exists' => 'The selected restaurant does not exist.'
            ];


            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'price' => 'required|numeric|min:0',
                'menu_category_id' => 'required|exists:menu_categories,id',
                'restaurant_id' => 'required|exists:restaurants,id'
            ], $messages);

            $menuItem = new MenuItem();
            $menuItem->name = $request->name;
            $menuItem->description = $request->description;
            $menuItem->price = $request->price;
            $menuItem->menu_category_id = $request->menu_category_id;
            $menuItem->restaurant_id = $request->restaurant_id;
            $menuItem->save();

            return response()->json([
                'status' => true,
                'message' => 'Menu item created successfully',
                'menu_item' => $menuItem,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $restaurantId, int $menuItemId)
    {
        //
        $restaurant = Restaurant::find($restaurantId);
        if(!$restaurant){
            return response()->json([
                'status' => false,
                'message' => 'Restaurant not found',
            ], 404);
        }

        $menuItem = MenuItem::where('restaurant_id', $restaurant->id)
                            ->where('id', $menuItemId)
                            ->first();

        if (!$menuItem) {
            return response()->json([
                'status' => false,
                'message' => 'Menu item not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'menu_item' => $menuItem,
            'message' => 'Menu item retrieved successfully',
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,int $restaurantId, int $menuItemId)
    {
        //

        $menuItem = MenuItem::where('restaurant_id', $restaurantId)
                            ->where('id', $menuItemId)
                            ->first();
                    
        if(!$menuItem){
            return response()->json([
                'status' => false,
                'message' => 'Menu item not found',
            ], 404);
        }

        try {

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'menu_category_id' => 'required|exists:menu_categories,id',
            'restaurant_id' => 'required|exists:restaurants,id'
        ]);

        $menuItem->name = $request->name;
        $menuItem->description = $request->description;
        $menuItem->price = $request->price;
        $menuItem->menu_category_id = $request->menu_category_id;
        $menuItem->restaurant_id = $request->restaurant_id;
        $menuItem->save();

        return response()->json([
            'status' => true,
            'message' => 'Menu item updated successfully',
            'menu_item' => $menuItem,
        ]);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $restaurantId, int $menuItemId)
    {
        //
        $menuItem = MenuItem::where('restaurant_id', $restaurantId)
                            ->where('id', $menuItemId)
                            ->first();

        if (!$menuItem) {
            return response()->json([
                'status' => false,
                'message' => 'Menu item not found',
            ], 404);
        }

        try {
            $menuItem->delete();

            return response()->json([
                'status'=> true,
                'message'=> 'Menu item deleted successfully',
                ],200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete menu item: ' . $e->getMessage(),
            ], 500);
        }
    }
}
