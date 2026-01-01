<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TourResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'price' => $this->price,
            'duration_days' => $this->duration_days,
            'max_group_size' => $this->max_group_size,
            'difficulty_level' => $this->difficulty_level,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'is_active' => $this->is_active,
            'is_eco_friendly' => $this->is_eco_friendly,
            'included_services' => $this->included_services,
            'excluded_services' => $this->excluded_services,
            'destinations' => $this->whenLoaded('destinations', function () {
                return $this->destinations->map(function ($destination) {
                    return [
                        'id' => $destination->id,
                        'name' => $destination->name,
                        'city' => $destination->city,
                        'country' => $destination->country,
                        'days_at_destination' => $destination->pivot->days_at_destination,
                        'order' => $destination->pivot->order,
                    ];
                });
            }),
            'hotels' => $this->whenLoaded('hotels', function () {
                return $this->hotels->map(function ($hotel) {
                    return [
                        'id' => $hotel->id,
                        'name' => $hotel->name,
                        'city' => $hotel->city,
                        'country' => $hotel->country,
                        'star_rating' => $hotel->star_rating,
                        'nights' => $hotel->pivot->nights,
                        'order' => $hotel->pivot->order,
                    ];
                });
            }),
            'reviews_count' => $this->whenCounted('reviews'),
            'average_rating' => $this->when(isset($this->reviews_avg_rating), $this->reviews_avg_rating),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
