<?php

namespace App\Filament\Resources\TourFlights\Pages;

use App\Filament\Resources\TourFlights\TourFlightResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTourFlights extends ListRecords
{
    protected static string $resource = TourFlightResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
