<?php

namespace App\Filament\Resources\CustomTourBookings;

use App\Filament\Resources\CustomTourBookings\Pages\CreateCustomTourBooking;
use App\Filament\Resources\CustomTourBookings\Pages\EditCustomTourBooking;
use App\Filament\Resources\CustomTourBookings\Pages\ListCustomTourBookings;
use App\Filament\Resources\CustomTourBookings\Pages\ViewCustomTourBooking;
use App\Filament\Resources\CustomTourBookings\Schemas\CustomTourBookingForm;
use App\Filament\Resources\CustomTourBookings\Schemas\CustomTourBookingInfolist;
use App\Filament\Resources\CustomTourBookings\Tables\CustomTourBookingsTable;
use App\Models\CustomTourBooking;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class CustomTourBookingResource extends Resource
{
    protected static ?string $model = CustomTourBooking::class;

    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'Custom Tour Requests';

    protected static ?string $modelLabel = 'Custom Tour Request';

    protected static ?string $pluralModelLabel = 'Custom Tour Requests';

    protected static string | UnitEnum | null $navigationGroup = 'Bookings';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'booking_reference';

    public static function form(Schema $schema): Schema
    {
        return CustomTourBookingForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return CustomTourBookingInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CustomTourBookingsTable::configure($table);
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
            'index' => ListCustomTourBookings::route('/'),
            'create' => CreateCustomTourBooking::route('/create'),
            'view' => ViewCustomTourBooking::route('/{record}'),
            'edit' => EditCustomTourBooking::route('/{record}/edit'),
        ];
    }
}
