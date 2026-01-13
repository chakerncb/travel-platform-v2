<?php

namespace App\Filament\Resources\TourFlights\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;

class TourFlightsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('customTourBooking.booking_reference')
                    ->label('Booking Ref')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customTourBooking.user_name')
                    ->label('Customer')
                    ->searchable(),
                TextColumn::make('segment_index')
                    ->label('Segment')
                    ->badge()
                    ->sortable(),
                TextColumn::make('route_description')
                    ->label('Route')
                    ->searchable(['origin_city', 'destination_city', 'origin_airport_code', 'destination_airport_code']),
                TextColumn::make('departure_datetime')
                    ->label('Departure')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
                TextColumn::make('arrival_datetime')
                    ->label('Arrival')
                    ->dateTime('M d, Y H:i'),
                TextColumn::make('duration')
                    ->label('Duration'),
                TextColumn::make('airline_code')
                    ->label('Airline')
                    ->badge(),
                TextColumn::make('flight_number')
                    ->label('Flight #'),
                TextColumn::make('number_of_stops')
                    ->label('Stops')
                    ->badge()
                    ->color(fn ($state) => $state == 0 ? 'success' : ($state == 1 ? 'warning' : 'danger')),
                TextColumn::make('formatted_price')
                    ->label('Price')
                    ->sortable('price_amount'),
                TextColumn::make('customTourBooking.status')
                    ->label('Booking Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'gray',
                        'under_review' => 'info',
                        'admin_proposed' => 'warning',
                        'user_confirmed' => 'info',
                        'paid' => 'success',
                        'rejected' => 'danger',
                        'completed' => 'success',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')
                    ->label('Booked At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('customTourBooking.status')
                    ->label('Booking Status')
                    ->options([
                        'pending' => 'Pending',
                        'under_review' => 'Under Review',
                        'admin_proposed' => 'Admin Proposed',
                        'user_confirmed' => 'User Confirmed',
                        'paid' => 'Paid',
                        'rejected' => 'Rejected',
                        'completed' => 'Completed',
                    ]),
                SelectFilter::make('number_of_stops')
                    ->label('Number of Stops')
                    ->options([
                        0 => 'Direct',
                        1 => '1 Stop',
                        2 => '2 Stops',
                        3 => '3+ Stops',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('departure_datetime', 'desc');
    }
}

