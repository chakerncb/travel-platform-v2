<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'city' => $this->city,
            'country' => $this->country,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'star_rating' => $this->star_rating,
            'price_per_night' => $this->price_per_night,
            'is_active' => $this->is_active,
            'specifications' => $this->whenLoaded('specifications', function () {
                return $this->specifications ? [
                    'has_wifi' => $this->specifications->has_wifi,
                    'has_parking' => $this->specifications->has_parking,
                    'has_pool' => $this->specifications->has_pool,
                    'has_gym' => $this->specifications->has_gym,
                    'has_spa' => $this->specifications->has_spa,
                    'has_restaurant' => $this->specifications->has_restaurant,
                    'has_bar' => $this->specifications->has_bar,
                    'has_room_service' => $this->specifications->has_room_service,
                    'has_airport_shuttle' => $this->specifications->has_airport_shuttle,
                    'has_pet_friendly' => $this->specifications->has_pet_friendly,
                    'has_air_conditioning' => $this->specifications->has_air_conditioning,
                    'has_laundry' => $this->specifications->has_laundry,
                    'has_conference_room' => $this->specifications->has_conference_room,
                    'check_in_time' => $this->specifications->check_in_time,
                    'check_out_time' => $this->specifications->check_out_time,
                    'total_rooms' => $this->specifications->total_rooms,
                ] : null;
            }),
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_path' => asset('storage/' . $image->image_path),
                        'alt_text' => $image->alt_text,
                        'is_primary' => $image->is_primary,
                        'order' => $image->order,
                    ];
                });
            }),
            'primary_image' => $this->whenLoaded('primaryImage', function () {
                return $this->primaryImage ? asset('storage/' . $this->primaryImage->image_path) : null;
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
