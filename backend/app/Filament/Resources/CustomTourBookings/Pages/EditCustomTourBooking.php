<?php

namespace App\Filament\Resources\CustomTourBookings\Pages;

use App\Filament\Resources\CustomTourBookings\CustomTourBookingResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditCustomTourBooking extends EditRecord
{
    protected static string $resource = CustomTourBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
