<?php

namespace App\Filament\Resources\CustomTourBookings\Pages;

use App\Filament\Resources\CustomTourBookings\CustomTourBookingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCustomTourBookings extends ListRecords
{
    protected static string $resource = CustomTourBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
