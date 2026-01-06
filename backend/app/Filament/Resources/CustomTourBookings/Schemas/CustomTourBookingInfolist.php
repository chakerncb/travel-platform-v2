<?php

namespace App\Filament\Resources\CustomTourBookings\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class CustomTourBookingInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('booking_reference'),
                TextEntry::make('user_email'),
                TextEntry::make('user_name'),
                TextEntry::make('number_of_persons')
                    ->numeric(),
                TextEntry::make('proposed_price')
                    ->money(),
                TextEntry::make('minimum_price')
                    ->money(),
                TextEntry::make('estimated_hotel_cost')
                    ->money(),
                TextEntry::make('admin_price')
                    ->money()
                    ->placeholder('-'),
                TextEntry::make('final_price')
                    ->money()
                    ->placeholder('-'),
                TextEntry::make('notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('admin_notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('status'),
                TextEntry::make('payment_status'),
                TextEntry::make('payment_method')
                    ->placeholder('-'),
                TextEntry::make('paid_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('admin_reviewed_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('user_confirmed_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
