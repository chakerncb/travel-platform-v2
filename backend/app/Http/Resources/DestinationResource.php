<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DestinationResource extends JsonResource
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
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'city' => $this->city,
            'country' => $this->country,
            'is_active' => $this->is_active,
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
