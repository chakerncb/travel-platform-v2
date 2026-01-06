<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class UserTourController extends Controller
{
    /**
     * Get all tours for the authenticated user (from bookings).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $bookings = Booking::where('user_id', $user->id)
            ->with(['tour.destinations.primaryImage', 'tour.hotels.primaryImage'])
            ->orderBy('created_at', 'desc')
            ->get();

        $tours = $bookings->map(function ($booking) {
            $tour = $booking->tour;
            
            if (!$tour) {
                return null;
            }

            return [
                'booking_id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'booking_status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'booking_date' => $booking->created_at,
                'start_date' => $booking->start_date,
                'end_date' => $booking->end_date,
                'adults_count' => $booking->adults_count,
                'children_count' => $booking->children_count,
                'total_price' => $booking->total_price,
                'amount_paid' => $booking->amount_paid,
                'tour' => [
                    'id' => $tour->id,
                    'title' => $tour->title,
                    'type' => $tour->type,
                    'short_description' => $tour->short_description,
                    'description' => $tour->description,
                    'price' => $tour->price,
                    'duration_days' => $tour->duration_days,
                    'difficulty_level' => $tour->difficulty_level,
                    'is_eco_friendly' => $tour->is_eco_friendly,
                    'destinations' => $tour->destinations,
                    'hotels' => $tour->hotels,
                ],
            ];
        })->filter();

        return response()->json([
            'status' => true,
            'data' => $tours,
        ]);
    }

    /**
     * Get upcoming tours for the authenticated user.
     */
    public function upcoming(Request $request)
    {
        $user = $request->user();
        
        $bookings = Booking::where('user_id', $user->id)
            ->where('start_date', '>', now())
            ->whereIn('status', ['confirmed', 'pending'])
            ->with(['tour.destinations.primaryImage', 'tour.hotels.primaryImage'])
            ->orderBy('start_date', 'asc')
            ->get();

        $tours = $bookings->map(function ($booking) {
            $tour = $booking->tour;
            
            if (!$tour) {
                return null;
            }

            return [
                'booking_id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'booking_status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'start_date' => $booking->start_date,
                'end_date' => $booking->end_date,
                'adults_count' => $booking->adults_count,
                'children_count' => $booking->children_count,
                'total_price' => $booking->total_price,
                'tour' => [
                    'id' => $tour->id,
                    'title' => $tour->title,
                    'type' => $tour->type,
                    'short_description' => $tour->short_description,
                    'duration_days' => $tour->duration_days,
                    'difficulty_level' => $tour->difficulty_level,
                    'is_eco_friendly' => $tour->is_eco_friendly,
                    'destinations' => $tour->destinations,
                    'hotels' => $tour->hotels,
                ],
            ];
        })->filter();

        return response()->json([
            'status' => true,
            'data' => $tours,
        ]);
    }

    /**
     * Get past tours for the authenticated user.
     */
    public function past(Request $request)
    {
        $user = $request->user();
        
        $bookings = Booking::where('user_id', $user->id)
            ->where('end_date', '<', now())
            ->whereIn('status', ['confirmed', 'completed'])
            ->with(['tour.destinations.primaryImage', 'tour.hotels.primaryImage'])
            ->orderBy('end_date', 'desc')
            ->get();

        $tours = $bookings->map(function ($booking) {
            $tour = $booking->tour;
            
            if (!$tour) {
                return null;
            }

            return [
                'booking_id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'booking_status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'start_date' => $booking->start_date,
                'end_date' => $booking->end_date,
                'adults_count' => $booking->adults_count,
                'children_count' => $booking->children_count,
                'total_price' => $booking->total_price,
                'tour' => [
                    'id' => $tour->id,
                    'title' => $tour->title,
                    'type' => $tour->type,
                    'short_description' => $tour->short_description,
                    'duration_days' => $tour->duration_days,
                    'difficulty_level' => $tour->difficulty_level,
                    'is_eco_friendly' => $tour->is_eco_friendly,
                    'destinations' => $tour->destinations,
                    'hotels' => $tour->hotels,
                ],
            ];
        })->filter();

        return response()->json([
            'status' => true,
            'data' => $tours,
        ]);
    }
}
