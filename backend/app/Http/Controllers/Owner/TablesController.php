<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Process\FakeProcessSequence;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TablesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $restaurantId)
    {
        //
        $tables = Table::where('restaurant_id', $restaurantId)->get();
        if($tables->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No tables found',     
            ], 404);
        }

        return response()->json([
            'status' => true,
            'tables' => $tables,
            'message' => 'Tables retrieved successfully',
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, int $restaurantId)
    {
        //
        try{

            $messages = [
                // 'restaurant_id.required' => 'The restaurant ID is required.',
                // 'restaurant_id.exists' => 'The selected restaurant does not exist.',
                'table_number.required' => 'The table number is required.',
                'table_number.integer' => 'The table number must be an integer.',
                'table_number.min' => 'The table number must be at least 1.',
                // 'qrcode.string' => 'The QR code must be a string.',
                // 'qrcode.max' => 'The QR code may not be greater than 255 characters.',
            ];
            
            $request->validate([
                // 'restaurant_id' => 'required|exists:restaurants,id',
                'table_number' => 'required|integer|min:1',
                // 'qrcode' => 'nullable|string|max:255',
            ], $messages);


            $table = new Table();
            $table->restaurant_id = $restaurantId;
            $table->table_number = $request->table_number;
            // $table->qrcode = $request->qrcode;
            $table->save();

            return response()->json([
                'status' => true,
                'table' => $table,
                'message' => 'Table created successfully',
            ], 201);

        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $restaurantId, int $tableId)
    {
        //
        $table = Table::where('restaurant_id', $restaurantId)
                    ->where('id', $tableId)->first();

        if (!$table) {
            return response()->json([
                'status' => false,
                'message' => 'Table not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'table' => $table,
            'message' => 'Table retrieved successfully',
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $restaurantId, int $tableId)
    {
        //
        $table = Table::where('restaurant_id', $restaurantId)
                    ->where('id', $tableId)->first();

        if (!$table) {
            return response()->json([
                'status' => false,
                'message' => 'Table not found',
            ], 404);
        }

        try {
            
         $table->delete();

        return response()->json([
            'status' => true,
            'message' => 'Table deleted successfully',
        ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete table: ' . $e->getMessage(),
            ], 500);
        }
    }

    // /**
    //  * Generate a QR code for the table.
    //  */
    // public function generateQRCode()
    // {
    //     // Generate QR code with text "Hello, Laravel 11!"
    //     $logoPath = storage_path('app/public/icon.png');
    //     if (!file_exists($logoPath)) {
    //         return response()->json([
    //         'status' => false,
    //         'message' => 'Logo image not found at ' . $logoPath,
    //         ], 404);
    //     }
    //     $qrCode = QrCode::format('png')
    //             ->size(300)
    //             ->merge($logoPath, 0.3, true)
    //             ->generate('QR Code with Logo');

    //     return response($qrCode)->header('Content-Type', 'image/svg+xml');
    // }
}
