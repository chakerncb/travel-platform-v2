<?php

namespace App\Filament\Resources\CustomTourBookings\Schemas;

use App\Models\Hotel;
use App\Models\Destination;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
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
                Select::make('destinations')
                    ->multiple()
                    ->searchable()
                    ->preload()
                    ->relationship('destinations', 'name')
                    ->required(),
                Select::make('hotels')
                    ->multiple()
                    ->searchable()
                    ->preload()
                    ->relationship('hotels', 'name'),
                Select::make('admin_recommended_destinations')
                    ->multiple()
                    ->searchable()
                    ->preload()
                    ->options(Destination::query()->where('is_active', true)->pluck('name', 'id')),
                Select::make('admin_recommended_hotels')
                    ->multiple()
                    ->searchable()
                    ->preload()
                    ->options(Hotel::query()->where('is_active', true)->pluck('name', 'id')),
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
