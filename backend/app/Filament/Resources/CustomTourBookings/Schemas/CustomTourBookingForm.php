<?php

namespace App\Filament\Resources\CustomTourBookings\Schemas;

use App\Models\Hotel;
use App\Models\Destination;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CustomTourBookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Customer Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('booking_reference')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->columnSpan(1),
                                Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'under_review' => 'Under Review',
                                        'admin_proposed' => 'Admin Proposed',
                                        'user_confirmed' => 'User Confirmed',
                                        'rejected' => 'Rejected',
                                        'paid' => 'Paid',
                                        'completed' => 'Completed',
                                    ])
                                    ->required()
                                    ->default('pending')
                                    ->columnSpan(1),
                            ]),
                        Grid::make(2)
                            ->schema([
                                TextInput::make('user_name')
                                    ->required()
                                    ->columnSpan(1),
                                TextInput::make('user_email')
                                    ->email()
                                    ->required()
                                    ->columnSpan(1),
                            ]),
                        Grid::make(3)
                            ->schema([
                                DatePicker::make('start_date')
                                    ->required()
                                    ->columnSpan(1),
                                DatePicker::make('end_date')
                                    ->columnSpan(1),
                                TextInput::make('number_of_persons')
                                    ->required()
                                    ->numeric()
                                    ->minValue(1)
                                    ->columnSpan(1),
                            ]),
                    ])
                    ->collapsible(),
                
                Section::make('Destinations & Hotels')
                    ->schema([
                        Select::make('destinations')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->relationship('destinations', 'name')
                            ->required()
                            ->columnSpanFull(),
                        Select::make('hotels')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->relationship('hotels', 'name')
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
                
                Section::make('Flights')
                    ->schema([
                        Repeater::make('flights')
                            ->relationship('flights')
                            ->schema([
                                Grid::make(3)
                                    ->schema([
                                        TextInput::make('segment_index')
                                            ->label('Segment #')
                                            ->numeric()
                                            ->disabled()
                                            ->columnSpan(1),
                                        TextInput::make('origin_airport_code')
                                            ->label('From')
                                            ->required()
                                            ->columnSpan(1),
                                        TextInput::make('destination_airport_code')
                                            ->label('To')
                                            ->required()
                                            ->columnSpan(1),
                                    ]),
                                Grid::make(3)
                                    ->schema([
                                        DateTimePicker::make('departure_datetime')
                                            ->label('Departure')
                                            ->required()
                                            ->columnSpan(1),
                                        DateTimePicker::make('arrival_datetime')
                                            ->label('Arrival')
                                            ->required()
                                            ->columnSpan(1),
                                        TextInput::make('duration')
                                            ->label('Duration')
                                            ->columnSpan(1),
                                    ]),
                                Grid::make(4)
                                    ->schema([
                                        TextInput::make('airline_code')
                                            ->label('Airline')
                                            ->columnSpan(1),
                                        TextInput::make('flight_number')
                                            ->label('Flight #')
                                            ->columnSpan(1),
                                        TextInput::make('price_amount')
                                            ->label('Price')
                                            ->numeric()
                                            ->prefix('DA')
                                            ->required()
                                            ->columnSpan(1),
                                        TextInput::make('number_of_stops')
                                            ->label('Stops')
                                            ->numeric()
                                            ->default(0)
                                            ->columnSpan(1),
                                    ]),
                            ])
                            ->collapsible()
                            ->collapsed()
                            ->itemLabel(fn (array $state): ?string => 
                                isset($state['origin_airport_code'], $state['destination_airport_code']) 
                                    ? "Flight: {$state['origin_airport_code']} → {$state['destination_airport_code']}" 
                                    : 'Flight'
                            )
                            ->addActionLabel('Add Flight')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed(),
                
                Section::make('Pricing')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('proposed_price')
                                    ->required()
                                    ->numeric()
                                    ->prefix('DA')
                                    ->columnSpan(1),
                                TextInput::make('minimum_price')
                                    ->required()
                                    ->numeric()
                                    ->prefix('DA')
                                    ->columnSpan(1),
                            ]),
                        Grid::make(3)
                            ->schema([
                                TextInput::make('estimated_hotel_cost')
                                    ->numeric()
                                    ->default(0.0)
                                    ->prefix('DA')
                                    ->columnSpan(1),
                                TextInput::make('admin_price')
                                    ->numeric()
                                    ->prefix('DA')
                                    ->columnSpan(1),
                                TextInput::make('final_price')
                                    ->numeric()
                                    ->prefix('DA')
                                    ->columnSpan(1),
                            ]),
                    ])
                    ->collapsible(),
                
                Section::make('Admin Recommendations')
                    ->schema([
                        Select::make('admin_recommended_destinations')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->options(Destination::query()->where('is_active', true)->pluck('name', 'id'))
                            ->columnSpanFull(),
                        Select::make('admin_recommended_hotels')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->options(Hotel::query()->where('is_active', true)->pluck('name', 'id'))
                            ->columnSpanFull(),
                        Textarea::make('admin_notes')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
                
                Section::make('Payment Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Select::make('payment_status')
                                    ->options([
                                        'unpaid' => 'Unpaid',
                                        'paid' => 'Paid',
                                        'failed' => 'Failed',
                                        'refunded' => 'Refunded',
                                    ])
                                    ->required()
                                    ->default('unpaid')
                                    ->columnSpan(1),
                                TextInput::make('payment_method')
                                    ->columnSpan(1),
                            ]),
                        TextInput::make('payment_url')
                            ->url()
                            ->placeholder('https://chargily.com/payment/...')
                            ->columnSpanFull()
                            ->helperText('Payment link to be sent to customer'),
                        DateTimePicker::make('paid_at')
                            ->columnSpan(1),
                    ])
                    ->collapsible(),
                
                Section::make('Notes & Timestamps')
                    ->schema([
                        Textarea::make('notes')
                            ->label('Customer Notes')
                            ->rows(3)
                            ->columnSpanFull(),
                        Grid::make(2)
                            ->schema([
                                DateTimePicker::make('admin_reviewed_at')
                                    ->columnSpan(1),
                                DateTimePicker::make('user_confirmed_at')
                                    ->columnSpan(1),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}
