<?php

namespace App\Filament\Resources\Bookings\Schemas;

use App\Models\Tour;
use App\Models\User;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Booking Information')
                    ->description('Basic booking details')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Select::make('tour_id')
                                    ->label('Tour')
                                    ->relationship('tour', 'title')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->reactive()
                                    ->afterStateUpdated(function ($state, callable $set) {
                                        if ($state) {
                                            $tour = Tour::find($state);
                                            if ($tour) {
                                                $set('total_price', $tour->price);
                                            }
                                        }
                                    }),

                                Select::make('user_id')
                                    ->label('User Account')
                                    ->relationship('user', 'email')
                                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->f_name} {$record->l_name} ({$record->email})")
                                    ->searchable(['email', 'f_name', 'l_name'])
                                    ->preload()
                                    ->nullable()
                                    ->helperText('Leave empty for guest bookings'),

                                TextInput::make('booking_reference')
                                    ->label('Booking Reference')
                                    ->disabled()
                                    ->dehydrated(false)
                                    ->placeholder('Auto-generated'),

                                Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'confirmed' => 'Confirmed',
                                        'cancelled' => 'Cancelled',
                                    ])
                                    ->default('pending')
                                    ->required(),
                            ]),

                        Grid::make(2)
                            ->schema([
                                DatePicker::make('start_date')
                                    ->label('Start Date')
                                    ->required()
                                    ->reactive()
                                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                        $tourId = $get('tour_id');
                                        if ($tourId && $state) {
                                            $tour = Tour::find($tourId);
                                            if ($tour) {
                                                $endDate = \Carbon\Carbon::parse($state)
                                                    ->addDays($tour->duration_days - 1);
                                                $set('end_date', $endDate->format('Y-m-d'));
                                            }
                                        }
                                    }),

                                DatePicker::make('end_date')
                                    ->label('End Date')
                                    ->required(),
                            ]),

                        Grid::make(2)
                            ->schema([
                                TextInput::make('adults_count')
                                    ->label('Number of Adults')
                                    ->numeric()
                                    ->default(1)
                                    ->minValue(1)
                                    ->required()
                                    ->reactive()
                                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                        self::calculateTotalPrice($set, $get);
                                    }),

                                TextInput::make('children_count')
                                    ->label('Number of Children')
                                    ->numeric()
                                    ->default(0)
                                    ->minValue(0)
                                    ->required()
                                    ->reactive()
                                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                        self::calculateTotalPrice($set, $get);
                                    }),
                            ]),
                    ]),

                Section::make('Contact Information')
                    ->description('Primary contact details')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('contact_first_name')
                                    ->label('First Name')
                                    ->required()
                                    ->maxLength(255),

                                TextInput::make('contact_last_name')
                                    ->label('Last Name')
                                    ->required()
                                    ->maxLength(255),

                                TextInput::make('contact_email')
                                    ->label('Email')
                                    ->email()
                                    ->required()
                                    ->maxLength(255),

                                TextInput::make('contact_phone')
                                    ->label('Phone')
                                    ->tel()
                                    ->required()
                                    ->maxLength(255),

                                DatePicker::make('contact_date_of_birth')
                                    ->label('Date of Birth')
                                    ->required(),

                                TextInput::make('contact_passport_number')
                                    ->label('Passport Number')
                                    ->maxLength(255),

                                TextInput::make('contact_nationality')
                                    ->label('Nationality')
                                    ->maxLength(255),
                            ]),
                    ]),

                Section::make('Passengers Information')
                    ->description('Additional passengers details')
                    ->schema([
                        Repeater::make('passengers')
                            ->label('Additional Passengers')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        TextInput::make('first_name')
                                            ->required(),

                                        TextInput::make('last_name')
                                            ->required(),

                                        TextInput::make('email')
                                            ->email(),

                                        TextInput::make('phone')
                                            ->tel(),

                                        DatePicker::make('date_of_birth')
                                            ->label('Date of Birth'),

                                        TextInput::make('passport_number')
                                            ->label('Passport Number'),

                                        Select::make('passenger_type')
                                            ->options([
                                                'adult' => 'Adult',
                                                'child' => 'Child',
                                            ])
                                            ->default('adult'),
                                    ]),
                            ])
                            ->collapsible()
                            ->collapsed()
                            ->itemLabel(fn (array $state): ?string => $state['first_name'] ?? null),
                    ]),

                Section::make('Payment Information')
                    ->description('Payment and pricing details')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('total_price')
                                    ->label('Total Price')
                                    ->numeric()
                                    ->prefix('$')
                                    ->required()
                                    ->disabled()
                                    ->dehydrated(),

                                Select::make('payment_status')
                                    ->label('Payment Status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'partial' => 'Partial',
                                        'paid' => 'Paid',
                                        'failed' => 'Failed',
                                        'refunded' => 'Refunded',
                                    ])
                                    ->default('pending')
                                    ->required(),

                                TextInput::make('amount_paid')
                                    ->label('Amount Paid')
                                    ->numeric()
                                    ->prefix('$')
                                    ->default(0),
                            ]),

                        Grid::make(3)
                            ->schema([
                                Select::make('payment_method')
                                    ->label('Payment Method')
                                    ->options([
                                        'cash' => 'Cash',
                                        'credit_card' => 'Credit Card',
                                        'debit_card' => 'Debit Card',
                                        'bank_transfer' => 'Bank Transfer',
                                        'paypal' => 'PayPal',
                                        'stripe' => 'Stripe',
                                    ]),

                                TextInput::make('payment_transaction_id')
                                    ->label('Transaction ID')
                                    ->maxLength(255),

                                DatePicker::make('payment_date')
                                    ->label('Payment Date'),
                            ]),
                    ]),

                Section::make('Additional Information')
                    ->description('Special requests and cancellation details')
                    ->schema([
                        Textarea::make('special_requests')
                            ->label('Special Requests')
                            ->rows(3)
                            ->maxLength(1000),

                        Grid::make(2)
                            ->schema([
                                DatePicker::make('cancelled_at')
                                    ->label('Cancelled At')
                                    ->disabled()
                                    ->hidden(fn ($record) => !$record || !$record->cancelled_at),

                                Textarea::make('cancellation_reason')
                                    ->label('Cancellation Reason')
                                    ->rows(2)
                                    ->disabled()
                                    ->hidden(fn ($record) => !$record || !$record->cancellation_reason),
                            ]),
                    ]),
            ]);
    }

    protected static function calculateTotalPrice(callable $set, callable $get): void
    {
        $tourId = $get('tour_id');
        $adults = (int) $get('adults_count') ?: 0;
        $children = (int) $get('children_count') ?: 0;

        if ($tourId) {
            $tour = Tour::find($tourId);
            if ($tour) {
                $basePrice = floatval($tour->price);
                $childPrice = $basePrice * 0.5; // 50% discount for children
                $totalPrice = ($adults * $basePrice) + ($children * $childPrice);
                $set('total_price', number_format($totalPrice, 2, '.', ''));
            }
        }
    }
}
