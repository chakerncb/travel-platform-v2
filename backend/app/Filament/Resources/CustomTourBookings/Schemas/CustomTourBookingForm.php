<?php

namespace App\Filament\Resources\CustomTourBookings\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class CustomTourBookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('booking_reference')
                    ->required(),
                TextInput::make('user_email')
                    ->email()
                    ->required(),
                TextInput::make('user_name')
                    ->required(),
                TextInput::make('number_of_persons')
                    ->required()
                    ->numeric(),
                TextInput::make('proposed_price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('minimum_price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('estimated_hotel_cost')
                    ->tel()
                    ->required()
                    ->numeric()
                    ->default(0.0)
                    ->prefix('$'),
                TextInput::make('admin_price')
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('final_price')
                    ->numeric()
                    ->prefix('$'),
                Textarea::make('notes')
                    ->columnSpanFull(),
                Textarea::make('admin_notes')
                    ->columnSpanFull(),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                TextInput::make('destinations')
                    ->required(),
                TextInput::make('hotels')
                    ->tel(),
                TextInput::make('admin_recommended_destinations'),
                TextInput::make('admin_recommended_hotels')
                    ->tel(),
                TextInput::make('payment_status')
                    ->required()
                    ->default('unpaid'),
                TextInput::make('payment_method'),
                DateTimePicker::make('paid_at'),
                DateTimePicker::make('admin_reviewed_at'),
                DateTimePicker::make('user_confirmed_at'),
            ]);
    }
}
