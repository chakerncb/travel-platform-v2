<?php

namespace App\Filament\Resources\Bookings\Pages;

use App\Filament\Resources\Bookings\BookingResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBooking extends CreateRecord
{
    protected static string $resource = BookingResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Booking created successfully';
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Auto-calculate total price if not set
        if (!isset($data['total_price']) || $data['total_price'] == 0) {
            $tour = \App\Models\Tour::find($data['tour_id']);
            if ($tour) {
                $adults = $data['adults_count'] ?? 0;
                $children = $data['children_count'] ?? 0;
                $basePrice = floatval($tour->price);
                $childPrice = $basePrice * 0.5;
                $data['total_price'] = ($adults * $basePrice) + ($children * $childPrice);
            }
        }

        return $data;
    }
}
