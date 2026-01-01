<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\MenuCategorie;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MenuCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $restaurantId)
    {
        //
        $categories = MenuCategorie::all()
            ->where('restaurant_id', $restaurantId);

        if ($categories->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No menu categories found',
            ], 404);
        }
        return response()->json([
            'status' => true,
            'categories' => $categories,
            'message' => 'Menu categories retrieved successfully',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, int $restaurantId)
    {
        //
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255',
                'active' => 'boolean',
            ]);

            $userID = Auth::user()->id;
            $user = User::find($userID);
            
            $categorie = new MenuCategorie();
            $categorie->name = $request->name;
            $categorie->slug = $request->slug;
            $categorie->active = $request->active ?? true;
            $categorie->restaurant_id = $restaurantId;
            $categorie->save();
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
        return response()->json([
            'status' => true,
            'category' => $categorie,
            'message' => 'Menu category created successfully',
        ]);

    }

    /**
     * Display the specified resource.
     */
    public function show(int $restaurantId, int $categoryId)
    {
        //
        $categorie = MenuCategorie::find($categoryId);
            // ->where('restaurant_id', $restaurantId)
            // ->first();

        if (!$categorie) {
            return response()->json([
                'status' => false,
                'categoryId' => $categoryId,
                'message' => 'Menu category not found',
            ], 404);
        }
        return response()->json([
            'status' => true,
            'category' => $categorie,
            'message' => 'Menu category retrieved successfully',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,int $restaurantId, int $categoryId)
    {
        //
        $categorie = MenuCategorie::find($categoryId);
            // ->where('restaurant_id', $restaurantId)
            // ->first();

        if (!$categorie) {
            return response()->json([
                'status' => false,
                'message' => 'Menu category not found',
            ], 404);
        }

        try {
        
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'active' => 'boolean',
        ]);

        $categorie->name = $request->name;
        $categorie->slug = $request->slug;
        $categorie->active = $request->active;
        $categorie->save();

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
         
        return response()->json([
            'status' => true,
            'category' => $categorie,
            'message' => 'Menu category updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $restaurantId, int $categoryId)
    {
        //
        $categorie = MenuCategorie::find($categoryId);
            // ->where('restaurant_id', $restaurantId)
            // ->first();

        if (!$categorie) {
            return response()->json([
                'status' => false,
                'message' => 'Menu category not found',
            ], 404);
        }

        try {
            $categorie->delete();

            return response()->json([
                'status' => true,
                'message' => 'Menu category deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error deleting menu category: ' . $e->getMessage(),
            ], 500);
        }
            
    }
}
