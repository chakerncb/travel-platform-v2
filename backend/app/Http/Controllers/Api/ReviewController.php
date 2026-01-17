<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commenter;
use App\Models\Review;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Get all reviews for a tour
     */
    public function index(Request $request, $tourId)
    {
        $reviews = Review::where('tour_id', $tourId)
            ->with(['commenter.user'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'status' => true,
            'reviews' => $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at,
                    'user' => [
                        'id' => $review->commenter->user->id,
                        'name' => $review->commenter->user->f_name . ' ' . $review->commenter->user->l_name,
                        'email' => $review->commenter->user->email,
                    ],
                ];
            }),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'total' => $reviews->total(),
                'per_page' => $reviews->perPage(),
                'last_page' => $reviews->lastPage(),
            ],
        ]);
    }

    /**
     * Store a new review (authenticated users only)
     */
    public function store(Request $request, $tourId)
    {
        // Ensure user is authenticated
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'You must be authenticated to add a review.',
            ], 401);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:1000',
        ]);

        $tour = Tour::findOrFail($tourId);
        $user = Auth::user();

        // Check if user already reviewed this tour
        $existingCommenter = Commenter::where('tour_id', $tourId)
            ->where('user_id', $user->id)
            ->first();

        if ($existingCommenter) {
            $existingReview = Review::where('tour_id', $tourId)
                ->where('commenter_id', $existingCommenter->id)
                ->first();

            if ($existingReview) {
                return response()->json([
                    'status' => false,
                    'message' => 'You have already reviewed this tour.',
                ], 422);
            }
        }

        // Create or get commenter
        $commenter = Commenter::firstOrCreate([
            'tour_id' => $tourId,
            'user_id' => $user->id,
        ]);

        // Create review
        $review = Review::create([
            'tour_id' => $tourId,
            'commenter_id' => $commenter->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        $review->load('commenter.user');

        return response()->json([
            'status' => true,
            'message' => 'Review added successfully.',
            'review' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at,
                'user' => [
                    'id' => $review->commenter->user->id,
                    'name' => $review->commenter->user->f_name . ' ' . $review->commenter->user->l_name,
                    'email' => $review->commenter->user->email,
                ],
            ],
        ], 201);
    }

    /**
     * Update a review (authenticated user who created it only)
     */
    public function update(Request $request, $tourId, $reviewId)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'You must be authenticated to update a review.',
            ], 401);
        }

        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|string|min:10|max:1000',
        ]);

        $review = Review::where('id', $reviewId)
            ->where('tour_id', $tourId)
            ->firstOrFail();

        // Check if the authenticated user is the owner
        $commenter = Commenter::findOrFail($review->commenter_id);
        if ($commenter->user_id !== Auth::id()) {
            return response()->json([
                'status' => false,
                'message' => 'You can only update your own reviews.',
            ], 403);
        }

        $review->update($validated);
        $review->load('commenter.user');

        return response()->json([
            'status' => true,
            'message' => 'Review updated successfully.',
            'review' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at,
                'user' => [
                    'id' => $review->commenter->user->id,
                    'name' => $review->commenter->user->f_name . ' ' . $review->commenter->user->l_name,
                    'email' => $review->commenter->user->email,
                ],
            ],
        ]);
    }

    /**
     * Delete a review (authenticated user who created it only)
     */
    public function destroy($tourId, $reviewId)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'You must be authenticated to delete a review.',
            ], 401);
        }

        $review = Review::where('id', $reviewId)
            ->where('tour_id', $tourId)
            ->firstOrFail();

        // Check if the authenticated user is the owner
        $commenter = Commenter::findOrFail($review->commenter_id);
        if ($commenter->user_id !== Auth::id()) {
            return response()->json([
                'status' => false,
                'message' => 'You can only delete your own reviews.',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'status' => true,
            'message' => 'Review deleted successfully.',
        ]);
    }

    /**
     * Check if the authenticated user has reviewed a tour
     */
    public function checkUserReview($tourId)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => true,
                'has_reviewed' => false,
            ]);
        }

        $commenter = Commenter::where('tour_id', $tourId)
            ->where('user_id', Auth::id())
            ->first();

        if (!$commenter) {
            return response()->json([
                'status' => true,
                'has_reviewed' => false,
            ]);
        }

        $review = Review::where('tour_id', $tourId)
            ->where('commenter_id', $commenter->id)
            ->first();

        if (!$review) {
            return response()->json([
                'status' => true,
                'has_reviewed' => false,
            ]);
        }

        return response()->json([
            'status' => true,
            'has_reviewed' => true,
            'review' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at,
            ],
        ]);
    }
}
