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

   /**
    * Register or login user via OAuth (Google, GitHub, etc.)
    * Email is already verified by the OAuth provider
    */
   public function oauthRegister(Request $request)
   {
      $request->validate([
         'email' => 'required|email',
         'name' => 'required|string',
         'provider' => 'required|string|in:google,github',
         'provider_id' => 'required|string',
      ]);

      // Check if user already exists
      $user = User::where('email', $request->email)->first();

      if ($user) {
         // User exists, generate token and return
         $token = $user->createToken('auth_token')->plainTextToken;

         return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'User' => $user
         ]);
      }

      // User doesn't exist, create new user
      // Split name into first and last name
      $nameParts = explode(' ', $request->name, 2);
      $firstName = $nameParts[0];
      $lastName = $nameParts[1] ?? '';

      $user = new User();
      $user->f_name = $firstName;
      $user->l_name = $lastName;
      $user->email = $request->email;
      $user->password = Hash::make(bin2hex(random_bytes(16))); // Random password for OAuth users
      $user->phone = $request->phone ?? ''; // Optional
      $user->address = $request->address ?? '';
      $user->is_admin = false;
      $user->email_verified_at = now(); // OAuth providers verify email
      $user->save();

      if (!$user) {
         return response()->json([
            'status' => false,
            'message' => 'User registration failed'
         ], 500);
      }

      // Generate token for the new user
      $token = $user->createToken('auth_token')->plainTextToken;

      return response()->json([
         'status' => true,
         'message' => 'User registered successfully via OAuth',
         'token' => $token,
         'User' => $user
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

   /**
    * Verify email from frontend confirmation page
    * Expects email and code (base64 encoded JSON) parameters
    */
   public function confirmEmail(Request $request)
   {
      try {
         $email = $request->query('email');
         $code = $request->query('code');
         
         if (!$email || !$code) {
            return response()->json([
               'status' => false,
               'error' => 'Email or code is missing'
            ], 400);
         }
         
         // Decode the verification token
         $decodedToken = json_decode(base64_decode($code), true);
         
         if (!$decodedToken || !isset($decodedToken['id'], $decodedToken['hash'], $decodedToken['expires'], $decodedToken['signature'])) {
            return response()->json([
               'status' => false,
               'error' => 'Invalid verification code'
            ], 400);
         }
         
         // Find the user
         $user = User::find($decodedToken['id']);
         
         if (!$user) {
            return response()->json([
               'status' => false,
               'error' => 'User not found'
            ], 404);
         }
         
         // Verify email matches
         if ($user->email !== $email) {
            return response()->json([
               'status' => false,
               'error' => 'Email does not match'
            ], 400);
         }
         
         // Verify the hash
         if (!hash_equals($decodedToken['hash'], sha1($user->getEmailForVerification()))) {
            return response()->json([
               'status' => false,
               'error' => 'Invalid verification link'
            ], 400);
         }
         
         // Check if token expired
         if (time() > $decodedToken['expires']) {
            return response()->json([
               'status' => false,
               'error' => 'Verification link has expired'
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
         
      } catch (\Exception $e) {
         return response()->json([
            'status' => false,
            'error' => 'An error occurred during verification: ' . $e->getMessage()
         ], 500);
      }
   }
   
}