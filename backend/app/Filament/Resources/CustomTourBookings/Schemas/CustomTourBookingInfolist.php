<?php

namespace App\Filament\Resources\CustomTourBookings\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CustomTourBookingInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Booking Details')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextEntry::make('booking_reference')
                                    ->badge()
                                    ->color('success'),
                                TextEntry::make('status')
                                    ->badge()
                                    ->color(fn (string $state): string => match ($state) {
                                        'pending' => 'warning',
                                        'under_review' => 'info',
                                        'admin_proposed' => 'primary',
                                        'user_confirmed' => 'success',
                                        'paid' => 'success',
                                        'completed' => 'success',
                                        'rejected' => 'danger',
                                        default => 'gray',
                                    }),
                                TextEntry::make('payment_status')
                                    ->badge()
                                    ->color(fn (string $state): string => match ($state) {
                                        'paid' => 'success',
                                        'unpaid' => 'warning',
                                        'failed' => 'danger',
                                        'refunded' => 'info',
                                        default => 'gray',
                                    }),
                            ]),
                    ]),
                
                Section::make('Customer Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('user_name'),
                                TextEntry::make('user_email')
                                    ->copyable(),
                            ]),
                        Grid::make(3)
                            ->schema([
                                TextEntry::make('start_date')
                                    ->date()
                                    ->placeholder('-'),
                                TextEntry::make('end_date')
                                    ->date()
                                    ->placeholder('-'),
                                TextEntry::make('number_of_persons')
                                    ->numeric()
                                    ->suffix(' people'),
                            ]),
                    ])
                    ->collapsible(),
                
                Section::make('Destinations')
                    ->schema([
                        TextEntry::make('destinations.name')
                            ->listWithLineBreaks()
                            ->badge()
                            ->color('info')
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
                
                Section::make('Hotels')
                    ->schema([
                        TextEntry::make('hotels.name')
                            ->listWithLineBreaks()
                            ->badge()
                            ->color('warning')
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
                
                Section::make('Flights')
                    ->schema([
                        TextEntry::make('flights')
                            ->label('')
                            ->formatStateUsing(function ($state, $record) {
                                // Handle both collection and array
                                $flightsList = is_array($state) ? $state : ($state ? $state->all() : []);
                                
                                if (empty($flightsList)) {
                                    return 'No flights selected';
                                }
                                
                                $flights = [];
                                foreach ($flightsList as $flight) {
                                    $flights[] = sprintf(
                                        'Segment %d: %s → %s | %s | DA %s',
                                        ($flight->segment_index ?? 0) + 1,
                                        $flight->origin_airport_code ?? 'N/A',
                                        $flight->destination_airport_code ?? 'N/A',
                                        $flight->departure_datetime ? date('M d, Y', strtotime($flight->departure_datetime)) : 'N/A',
                                        number_format($flight->price_amount ?? 0, 2)
                                    );
                                }
                                
                                return implode("\n", $flights);
                            })
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed(),
                
                Section::make('Pricing')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextEntry::make('proposed_price')
                                    ->money('DZD'),
                                TextEntry::make('minimum_price')
                                    ->money('DZD'),
                                TextEntry::make('estimated_hotel_cost')
                                    ->money('DZD'),
                            ]),
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('admin_price')
                                    ->money('DZD')
                                    ->placeholder('-'),
                                TextEntry::make('final_price')
                                    ->money('DZD')
                                    ->placeholder('-')
                                    ->size('lg')
                                    ->weight('bold'),
                            ]),
                    ])
                    ->collapsible(),
                
                Section::make('Admin Information')
                    ->schema([
                        TextEntry::make('admin_recommended_destinations')
                            ->label('Recommended Destinations')
                            ->listWithLineBreaks()
                            ->placeholder('-')
                            ->columnSpanFull(),
                        TextEntry::make('admin_recommended_hotels')
                            ->label('Recommended Hotels')
                            ->listWithLineBreaks()
                            ->placeholder('-')
                            ->columnSpanFull(),
                        TextEntry::make('admin_notes')
                            ->placeholder('-')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed(),
                
                Section::make('Payment Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('payment_method')
                                    ->placeholder('-'),
                                TextEntry::make('paid_at')
                                    ->dateTime()
                                    ->placeholder('-'),
                            ]),
                        TextEntry::make('payment_url')
                            ->url(fn ($state) => $state)
                            ->openUrlInNewTab()
                            ->placeholder('-')
                            ->copyable()
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
                
                Section::make('Notes & History')
                    ->schema([
                        TextEntry::make('notes')
                            ->label('Customer Notes')
                            ->placeholder('-')
                            ->columnSpanFull(),
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('created_at')
                                    ->dateTime(),
                                TextEntry::make('admin_reviewed_at')
                                    ->dateTime()
                                    ->placeholder('-'),
                            ]),
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('user_confirmed_at')
                                    ->dateTime()
                                    ->placeholder('-'),
                                TextEntry::make('updated_at')
                                    ->dateTime(),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}
