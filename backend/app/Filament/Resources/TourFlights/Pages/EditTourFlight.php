<?php

namespace App\Filament\Resources\TourFlights\Pages;

use App\Filament\Resources\TourFlights\TourFlightResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTourFlight extends EditRecord
{
    protected static string $resource = TourFlightResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
