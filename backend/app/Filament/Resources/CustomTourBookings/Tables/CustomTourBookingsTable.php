<?php

namespace App\Filament\Resources\CustomTourBookings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CustomTourBookingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('booking_reference')
                    ->label('Reference')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold')
                    ->color('primary'),
                TextColumn::make('user_name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('user_email')
                    ->label('Email')
                    ->searchable()
                    ->copyable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('destinations')
                    ->label('Destinations')
                    ->formatStateUsing(fn ($state) => is_array($state) ? count($state) : 0)
                    ->badge()
                    ->color('info'),
                TextColumn::make('hotels')
                    ->label('Hotels')
                    ->formatStateUsing(fn ($state) => is_array($state) ? count($state) : 0)
                    ->badge()
                    ->color('warning'),
                TextColumn::make('number_of_persons')
                    ->label('Persons')
                    ->numeric()
                    ->sortable()
                    ->alignCenter(),
                TextColumn::make('proposed_price')
                    ->label('User Price')
                    ->money('DZD')
                    ->sortable(),
                TextColumn::make('admin_proposed_price')
                    ->label('Admin Price')
                    ->money('DZD')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('final_price')
                    ->label('Final Price')
                    ->money('DZD')
                    ->sortable()
                    ->weight('bold')
                    ->color('success'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'admin_reviewing' => 'info',
                        'admin_proposed' => 'primary',
                        'user_confirmed' => 'success',
                        'payment_pending' => 'warning',
                        'completed' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Pending Review',
                        'admin_reviewing' => 'Under Review',
                        'admin_proposed' => 'Proposal Sent',
                        'user_confirmed' => 'Confirmed',
                        'payment_pending' => 'Payment Pending',
                        'completed' => 'Completed',
                        'rejected' => 'Rejected',
                        default => $state,
                    })
                    ->searchable()
                    ->sortable(),
                TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'paid' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        default => 'gray',
                    })
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->label('Submitted')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->toggleable(),
                TextColumn::make('admin_reviewed_at')
                    ->label('Reviewed At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('user_confirmed_at')
                    ->label('Confirmed At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending Review',
                        'admin_reviewing' => 'Under Review',
                        'admin_proposed' => 'Proposal Sent',
                        'user_confirmed' => 'Confirmed',
                        'payment_pending' => 'Payment Pending',
                        'completed' => 'Completed',
                        'rejected' => 'Rejected',
                    ])
                    ->default('pending'),
                SelectFilter::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
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
            ->defaultSort('created_at', 'desc')
            ->poll('30s');
    }
}
