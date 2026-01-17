<?php

namespace App\Filament\Resources\ChatRooms\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ChatRoomForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'id')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
                DateTimePicker::make('last_message_at'),
            ]);
    }
}
