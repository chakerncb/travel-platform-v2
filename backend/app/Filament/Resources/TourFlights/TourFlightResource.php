<?php

namespace App\Filament\Resources\TourFlights;

use App\Filament\Resources\TourFlights\Pages\CreateTourFlight;
use App\Filament\Resources\TourFlights\Pages\EditTourFlight;
use App\Filament\Resources\TourFlights\Pages\ListTourFlights;
use App\Filament\Resources\TourFlights\Schemas\TourFlightForm;
use App\Filament\Resources\TourFlights\Tables\TourFlightsTable;
use App\Models\TourFlight;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class TourFlightResource extends Resource
{
    protected static ?string $model = TourFlight::class;

    protected static BackedEnum | string | null $navigationIcon = 'heroicon-o-paper-airplane';

    protected static ?string $recordTitleAttribute = 'route_description';

    protected static string | UnitEnum | null $navigationGroup = 'Custom Tours';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return TourFlightForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TourFlightsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTourFlights::route('/'),
            'create' => CreateTourFlight::route('/create'),
            'edit' => EditTourFlight::route('/{record}/edit'),
        ];
    }
}
