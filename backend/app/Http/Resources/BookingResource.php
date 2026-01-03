<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
            'tour_id' => $this->tour_id,
            'user_id' => $this->user_id,
            'booking_reference' => $this->booking_reference,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'adults_count' => $this->adults_count,
            'children_count' => $this->children_count,
            'total_passengers' => $this->total_passengers,
            'total_price' => $this->total_price,
            'contact_first_name' => $this->contact_first_name,
            'contact_last_name' => $this->contact_last_name,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'contact_date_of_birth' => $this->contact_date_of_birth?->toDateString(),
            'contact_passport_number' => $this->contact_passport_number,
            'contact_nationality' => $this->contact_nationality,
            'passengers' => $this->passengers,
            'special_requests' => $this->special_requests,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'amount_paid' => $this->amount_paid,
            'payment_method' => $this->payment_method,
            'payment_transaction_id' => $this->payment_transaction_id,
            'payment_date' => $this->payment_date?->toISOString(),
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'cancellation_reason' => $this->cancellation_reason,
            'tour' => new TourResource($this->whenLoaded('tour')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
