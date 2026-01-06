<?php

namespace App\Filament\Resources\CustomTourBookings\Pages;

use App\Filament\Resources\CustomTourBookings\CustomTourBookingResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewCustomTourBooking extends ViewRecord
{
    protected static string $resource = CustomTourBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
