<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Mail\NewUserEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $users = User::all();
        if ($users->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No users found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'users' => $users,
            'message' => 'Users retrieved successfully',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $password = Str::random(8); 

        try {

        $request->validate([
            "f_name" => "required|string|max:255",
            "l_name" => "required|string|max:255",
            "email" => "required|email|max:255|unique:users,email",
            "phone" => "required|string|max:15|unique:users,phone",
            "address" => "string|max:255",
            "is_admin" => "boolean",
        ], 
        ['f_name.required' => 'First name is required.',
            'l_name.required' => 'Last name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'Email has already been taken.',
            'phone.required' => 'Phone number is required.',
            'phone.unique' => 'Phone number has already been taken.',        
        ]);

        $user = User::create([
            'f_name' => $request->f_name,
            'l_name' => $request->l_name,
            'email' => $request->email,
            'password' => Hash::make($password),
            'phone' => $request->phone,
            'address' => $request->address,
            'is_admin' => $request->is_admin,
        ]);
        
        // make the user verified
        $user->markEmailAsVerified();

        Mail::to($user->email)->send(new NewUserEmail([
            'name' => $user->f_name,
            'last_name' => $user->l_name,
            'email' => $user->email,
            'password' => $password, 
            "confirmed" => true
        ]));

        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error creating user: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status' => true,
            'user' => $user,
            'message' => 'User created successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found',
            ], 404);
        }
        return response()->json([
            'status' => true,
            'user' => $user,
            'message' => 'User retrieved successfully',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found',
            ], 404);
        }

        try {
            $user->update([
                'f_name' => $request->f_name,
                'l_name' => $request->l_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'is_admin' => $request->is_admin,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error updating user: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status' => true,
            'user' => $user,
            'message' => 'User updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found',
            ], 404);
        }

        $user->delete();
        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully',
        ]);
    }
}
