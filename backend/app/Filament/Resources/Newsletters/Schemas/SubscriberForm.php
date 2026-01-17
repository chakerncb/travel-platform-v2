<?php

namespace App\Filament\Resources\Newsletters\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SubscriberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Subscriber Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('email')
                                    ->email()
                                    ->required()
                                    ->maxLength(255)
                                    ->label('Email Address'),
                                
                                TextInput::make('name')
                                    ->maxLength(255)
                                    ->label('Name')
                                    ->nullable(),
                            ]),
                        
                        Toggle::make('is_subscribed')
                            ->label('Subscribed')
                            ->default(true)
                            ->required(),
                        
                        Grid::make(2)
                            ->schema([
                                DateTimePicker::make('subscribed_at')
                                    ->label('Subscribed At')
                                    ->nullable()
                                    ->native(false),
                                
                                DateTimePicker::make('unsubscribed_at')
                                    ->label('Unsubscribed At')
                                    ->nullable()
                                    ->native(false),
                            ]),
                    ]),
            ]);
    }
}
