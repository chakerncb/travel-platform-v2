<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    //

    // function __construct(){
    //     $this->middleware('auth');
    // }

    
    public function Checkout(Request $request){

        $messages = [
            'items.required' => 'At least one item must be added to the order.',
            'items.array' => 'Items must be provided as an array.',
            'items.min' => 'At least one item must be added to the order.',
            'items.*.menu_item_id.required' => 'Each item must have a menu item ID.',
            'items.*.menu_item_id.integer' => 'Menu item ID must be an integer.',
            'items.*.menu_item_id.exists' => 'Selected menu item does not exist.',
            'items.*.quantity.required' => 'Each item must have a quantity.',
            'items.*.quantity.integer' => 'Quantity must be an integer.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'items.*.notes.string' => 'Notes must be a string.',
            'restaurant_id.required' => 'Restaurant ID is required.',
            'restaurant_id.integer' => 'Restaurant ID must be an integer.',
            'restaurant_id.exists' => 'Selected restaurant does not exist.',
            'table_token.integer' => 'Table token must be an integer.',
        ];

        try {

         $request->validate([
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|integer|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
            'restaurant_id' => 'required|integer|exists:restaurants,id',
            'table_token' => 'nullable|integer',
        ],$messages);

        $order = new Order();
        $order->restaurant_id = $request['restaurant_id'];
        $order->table_id = $request['table_token'] ?? null;
        $order->user_id = Auth::check() ? Auth::id() : null;
        $order->total_amount = 0; 
        $order->status = 'pending';
        $order->invoice_path = null;
        $order->save();

        } catch (ValidationException $e) {
             return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'auth' =>  Auth::user()
            ], 422);
        }

        foreach ($request['items'] as $item) {
            $menuItem = MenuItem::find($item['menu_item_id']);

            $order->items()->create([
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
                'price' => $menuItem ? $menuItem->price : 0,
                'notes' => $item['notes'] ?? null
            ]);
        }

        return response()->json([
            'success' => true,
            'order_id' => $order->id,
            'message' => 'Order Created successfully',
            'items' => $request['items']
        ]);
    }
}
