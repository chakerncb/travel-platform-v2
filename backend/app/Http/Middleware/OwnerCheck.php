<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class OwnerCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $restaurantId = $request->route('restaurantId');
        if ($restaurantId === null) {
             return response()->json(['error' => 'Restaurant ID is required'], 400);
        }

        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userId = Auth::user()->id;
        $user = User::find($userId);

        if ($restaurantId !== null) {
            if (!$user->isOwnerOf((int)$restaurantId)) {
                return response()->json(['error' => 'Forbidden: You are not the owner of this restaurant'], 403);
            }
        }
        
        return $next($request);
    }
}
