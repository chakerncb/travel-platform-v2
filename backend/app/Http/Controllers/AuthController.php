<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

   public function register(RegisterRequest $request){

      // the validation is already handled by RegisterRequest

      $user = new User();
      $user->f_name = $request->f_name;
      $user->l_name = $request->l_name;
      $user->email = $request->email;
      $user->password = Hash::make($request->password);
      $user->address = $request->address ?? ''; // optional field
      $user->phone = $request->phone;
      $user->is_admin = false; // default value, can be changed later
      $user->save();

       // Send the email veuser: rification notification manually
       try {
         $user->sendEmailVerificationNotification();
       } catch (\Exception $e) {
         return response()->json([
            'status' => false,
            'message' => 'Failed to send verification email: ' . $e->getMessage()
         ], 500);
       }

      if(!$user){
         return response()->json([
            'status' => false,
            'message' => 'User registration failed'
         ], 500);
      }

      return response()->json([
         'status' => true,
         'message' => 'User registered successfully, please verify your email',
         ]);
   }
   public function login(LoginRequest $request){

      $user = User::where('email', $request->email)->first();

      if(!$user){
         return response()->json([
            'status' => false,
            'message' => 'You are not registered, please register first'
         ], 404);
      }

      // Check if the user is verified
      if (!$user->hasVerifiedEmail()) {
         return response()->json([
            'status' => false,
            'message' => 'Please verify your email before logging in'
         ], 403);
      }

      if(Hash::check($request->password, $user->password)){
         $token = $user->createToken('auth_token')->plainTextToken;

         return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'User'=> $user
         ]);
      } else {
         return response()->json([
            'status' => false,
            'message' => 'Invalid credentials'
         ], 401);
      }
   }

   public function logout(){
      
      Auth::logout();

      return response()->json([
         'status' => true,
         'message' => 'User logged out successfully'
      ]);
    
   }

   public function profile(){
      $user = Auth::user();

      return response()->json([
         'status' => true,
         'message'=> 'User profile retrieved successfully',
         'user' => $user
      ]);
    
   }

   public function EmailVerification(Request $request, $id, $hash)
   { 
    // Find the user
    $user = User::find($id);
    
    if (!$user) {
        return response()->json([
            'status' => false,
            'message' => 'User not found'
        ], 404);
    }
    
    // Verify the hash
    if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
        return response()->json([
            'status' => false,
            'message' => 'Invalid verification link'
        ], 400);
    }
    
    // Check if already verified
    if ($user->hasVerifiedEmail()) {
        return response()->json([
            'status' => true,
            'message' => 'Email already verified'
        ]);
    }
    
    // Mark as verified
    $user->markEmailAsVerified();
    
    return response()->json([
        'status' => true,
        'message' => 'Email verified successfully!'
    ]);
   }

   public function resendVerificationEmail(Request $request)
   {
       if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Already verified']);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => 'Verification link sent!']);
   }

   public function verificationNotice(Request $request)
   {
      if ($request->user()->hasVerifiedEmail()) {
         return response()->json(['message' => 'Already verified']);
      }
      return response()->json(['message' => 'Please verify your email']);
   }
   
}

