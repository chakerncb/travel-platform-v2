<?php

namespace App\Filament\Resources\TourFlights\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Schemas\Schema;
use App\Models\CustomTourBooking;

class TourFlightForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Booking Information')
                    ->schema([
                        Select::make('custom_tour_booking_id')
                            ->label('Custom Tour Booking')
                            ->relationship('customTourBooking', 'booking_reference')
                            ->required()
                            ->searchable()
                            ->preload(),
                        TextInput::make('segment_index')
                            ->label('Segment Index')
                            ->numeric()
                            ->required()
                            ->default(0),
                    ])->columns(2),

                Section::make('Flight Details')
                    ->schema([
                        TextInput::make('flight_offer_id')
                            ->label('Flight Offer ID')
                            ->required(),
                        Grid::make(2)->schema([
                            TextInput::make('airline_code')
                                ->label('Airline Code'),
                            TextInput::make('airline_name')
                                ->label('Airline Name'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('flight_number')
                                ->label('Flight Number'),
                            TextInput::make('aircraft_code')
                                ->label('Aircraft Code'),
                        ]),
                        Grid::make(2)->schema([
                            DateTimePicker::make('departure_datetime')
                                ->label('Departure')
                                ->required(),
                            DateTimePicker::make('arrival_datetime')
                                ->label('Arrival')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('duration')
                                ->label('Duration'),
                            TextInput::make('number_of_stops')
                                ->label('Number of Stops')
                                ->numeric()
                                ->default(0),
                        ]),
                    ]),

                Section::make('Origin Airport')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('origin_airport_code')
                                ->label('Airport Code')
                                ->required(),
                            TextInput::make('origin_airport_name')
                                ->label('Airport Name')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('origin_city')
                                ->label('City')
                                ->required(),
                            TextInput::make('origin_country')
                                ->label('Country'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('origin_latitude')
                                ->label('Latitude')
                                ->numeric(),
                            TextInput::make('origin_longitude')
                                ->label('Longitude')
                                ->numeric(),
                        ]),
                    ]),

                Section::make('Destination Airport')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('destination_airport_code')
                                ->label('Airport Code')
                                ->required(),
                            TextInput::make('destination_airport_name')
                                ->label('Airport Name')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('destination_city')
                                ->label('City')
                                ->required(),
                            TextInput::make('destination_country')
                                ->label('Country'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('destination_latitude')
                                ->label('Latitude')
                                ->numeric(),
                            TextInput::make('destination_longitude')
                                ->label('Longitude')
                                ->numeric(),
                        ]),
                    ]),

                Section::make('Pricing')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('price_amount')
                                ->label('Price Amount')
                                ->numeric()
                                ->required()
                                ->prefix('DA'),
                            TextInput::make('price_currency')
                                ->label('Currency')
                                ->default('DZD')
                                ->maxLength(3),
                        ]),
                    ]),
            ]);
    }
}

