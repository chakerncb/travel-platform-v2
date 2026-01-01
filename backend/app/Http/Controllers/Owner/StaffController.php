<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Mail\NewUserEmail;
use App\Models\Restaurant;
use App\Models\RestaurantUsersRole;
use App\Models\User;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

use function PHPUnit\Framework\returnSelf;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $restaurantId)
    {
        //
        $restaurant = Restaurant::find($restaurantId);
        if (!$restaurant) {
            return response()->json([
                'status' => false,
                'message' => 'Restaurant not found.',
            ], 404);
        }
        
        $staff = $restaurant->staff;
        if ($staff->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No staff found for this restaurant.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Staff retrieved successfully.',
            'data' => $staff,
        ], 200);
        

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request,int $restaurantId)
    {
        //

        $messages = [
            'f_name.required' => 'First name is required.',
            'f_name.string' => 'First name must be a string.',
            'f_name.max' => 'First name may not be greater than 255 characters.',
            'l_name.required' => 'Last name is required.',
            'l_name.string' => 'Last name must be a string.',
            'l_name.max' => 'Last name may not be greater than 255 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already taken.',
            'phone.required' => 'Phone number is required.',
            'phone.string' => 'Phone number must be a string.',
            'phone.max' => 'Phone number must be exactly 10 digits.',
            'phone.min' => 'Phone number must be exactly 10 digits.',
            "restaurant_role.exists"=> "Please provide a valid Role"
        ];

        try {

        $request->validate( [
            'f_name' => 'required|string|max:255',
            'l_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:10|min:10',
            'restaurant_role'=> 'required|integer|exists:restaurant_roles,id'
        ], $messages);

        
        $password = Str::random(8); 

        $user = new User();
        $user->f_name = $request->f_name;
        $user->l_name = $request->l_name;
        $user->phone = $request->phone;
        $user->email = $request->email;
        $user->password = Hash::make($password);
        $user->save();

        Mail::to($user->email)->send(new NewUserEmail([
            'name' => $user->f_name,
            'confirmed' => false,
            'email' => $user->email,
            'password' => $password, 
        ]));

        } catch (ValidationException $e) {
              return response()->json([
                  'status' => false,
                  'message'=> $e->getMessage(),
                  ], 422);
        }

        try {
          event(new Registered($user));
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'User registration failed, please try again later, ' . $e->getMessage()
            ], 500);
        }


        try {

        $restaurant = Restaurant::find($restaurantId);
        $restaurantOwner = new RestaurantUsersRole();
        $restaurantOwner->restaurant_id = $restaurant->id;
        $restaurantOwner->user_id = $user->id;
        $restaurantOwner->restaurant_role_id = $request->restaurant_role;
        $restaurantOwner->save();

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to assign restaurant owner: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status'=> true,
            'message'=> 'new staff added successfully',
            ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $restaurantId , int $staffId)
    {
        //
        $user = User::find($staffId);
        $restaurant = Restaurant::find($restaurantId);

        $restaurantIdUserRole = RestaurantUsersRole::where('user_id', $user->id)
                             ->where('restaurant_id', $restaurant->id)
                             ->first();

        if (!$restaurantIdUserRole) {
             return response()->json([
                'status'=> false,
                'message'=> 'Ther is no staff member with this id',
                ],404);
            }

        if(!$user){
           return response()->json([
              'status'=> false,
              'message'=> 'staff member not found',
              ],404);
        }

        $restaurantRoles = $user->restaurantRoles;

        return response()->json([
            'status'=> true,
            'message'=> 'user retreived succefully',
            'user'=> $user,
            ],200);


    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,int $restaurantId, int $staffId)
    {
        //
        $user = User::find($staffId);
        if(!$user){
            return response()->json([
                'status'=> false,
                'message'=> 'Staff member NOt Found',
                ],404);
            }

        $restaurantRole = RestaurantUsersRole::where('user_id', $user->id)
                       ->where('restaurant_id', $restaurantId)
                       ->first();

        if($restaurantRole){
            
        

        $request->validate([
            'restaurant_role_id' => 'required|integer|exists:restaurant_roles,id'
        ], [
            'restaurant_role_id.required' => 'Role is required.',
            'restaurant_role_id.integer' => 'Role must be an integer.',
            'restaurant_role_id.exists' => 'Please provide a valid Role.'
        ]);

        try{
            $restaurantRole->restaurant_role_id = $request->restaurant_role_id;
            $restaurantRole->save();
        }catch(Exception $e){
            return response()->json([
                'status'=> false,
                'message'=> $e->getMessage(),
                ],500);
            }

        }else{
           
            $request->validate([
            'restaurant_role_id' => 'required|integer|exists:restaurant_roles,id'
        ], [
            'restaurant_role_id.required' => 'Role is required.',
            'restaurant_role_id.integer' => 'Role must be an integer.',
            'restaurant_role_id.exists' => 'Please provide a valid Role.'
        ]);

        try{

            $restaurantUserRole = new RestaurantUsersRole();
            $restaurantUserRole->user_id = $user->id;
            $restaurantUserRole->restaurant_id = $restaurantId;
            $restaurantUserRole->restaurant_role_id = $request->restaurant_role_id;
            $restaurantUserRole->save();

        }catch(Exception $e){
            return response()->json([
                'status'=> false,
                'message'=> $e->getMessage(),
                ],500);
            }
        }

        return response()->json([
            'status'=> true,
            'message'=> 'Staff member role updated successfully'
            ],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $restaurantId, int $staffId)
    {
        //
        $user = User::find($staffId);
        if(!$user){
            return response()->json([
                'status'=> false,
                'message'=> 'Staff member not found'
            ], 200);
        }

        $restaurantRole = RestaurantUsersRole::where('user_id', $user->id)
                        ->where('restaurant_id', $restaurantId)
                        ->first();
        if(!$restaurantRole){
            return response()->json([
                'status'=> false,
                'message'=> 'this User is not a staff member'
                ],404);
            }
            $restaurantRole->delete();


        return response()->json([
                'status'=> true,
                'message'=> 'Staff member removed successfully'
                ],200);
                        
    }
}
