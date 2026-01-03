<?php

namespace App\Filament\Resources\Bookings\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class BookingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('booking_reference')
                    ->label('Reference')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->copyable()
                    ->copyMessage('Reference copied')
                    ->icon('heroicon-o-clipboard-document'),

                TextColumn::make('tour.title')
                    ->label('Tour')
                    ->searchable()
                    ->sortable()
                    ->limit(30)
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        return strlen($state) > 30 ? $state : null;
                    }),

                TextColumn::make('contact_first_name')
                    ->label('Customer')
                    ->formatStateUsing(fn ($record) => $record->contact_first_name . ' ' . $record->contact_last_name)
                    ->searchable(['contact_first_name', 'contact_last_name'])
                    ->sortable(),

                TextColumn::make('contact_email')
                    ->label('Email')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-o-envelope'),

                TextColumn::make('start_date')
                    ->label('Travel Date')
                    ->date('M d, Y')
                    ->sortable(),

                TextColumn::make('adults_count')
                    ->label('Adults')
                    ->alignCenter()
                    ->badge()
                    ->color('success'),

                TextColumn::make('children_count')
                    ->label('Children')
                    ->alignCenter()
                    ->badge()
                    ->color('info'),

                TextColumn::make('total_passengers')
                    ->label('Total')
                    ->alignCenter()
                    ->badge()
                    ->color('gray'),

                TextColumn::make('total_price')
                    ->label('Price')
                    ->money('USD')
                    ->sortable()
                    ->weight(FontWeight::Bold),

                TextColumn::make('status')
                    ->badge()
                    ->sortable()
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'confirmed',
                        'danger' => 'cancelled',
                    ]),

                TextColumn::make('payment_status')
                    ->label('Payment')
                    ->badge()
                    ->sortable()
                    ->colors([
                        'gray' => 'pending',
                        'warning' => 'partial',
                        'success' => 'paid',
                        'danger' => 'failed',
                        'info' => 'refunded',
                    ]),

                TextColumn::make('created_at')
                    ->label('Booked At')
                    ->dateTime('M d, Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Updated At')
                    ->dateTime('M d, Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->multiple(),

                SelectFilter::make('payment_status')
                    ->label('Payment Status')
                    ->options([
                        'pending' => 'Pending',
                        'partial' => 'Partial',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ])
                    ->multiple(),

                Filter::make('start_date')
                    ->form([
                        DatePicker::make('from')
                            ->label('Travel From'),
                        DatePicker::make('until')
                            ->label('Travel Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('start_date', '>=', $date),
                            )
                            ->when(
                                $data['until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('start_date', '<=', $date),
                            );
                    }),

                Filter::make('created_at')
                    ->form([
                        DatePicker::make('from')
                            ->label('Booked From'),
                        DatePicker::make('until')
                            ->label('Booked Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
                Action::make('confirm')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->action(fn ($record) => $record->confirm())
                    ->successNotificationTitle('Booking confirmed successfully'),
                
                Action::make('cancel')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->form([
                        TextInput::make('reason')
                            ->label('Cancellation Reason')
                            ->required(),
                    ])
                    ->visible(fn ($record) => $record->status !== 'cancelled')
                    ->action(function ($record, array $data) {
                        $record->cancel($data['reason']);
                    })
                    ->successNotificationTitle('Booking cancelled successfully'),

                Action::make('mark_paid')
                    ->label('Mark as Paid')
                    ->icon('heroicon-o-currency-dollar')
                    ->color('success')
                    ->form([
                        TextInput::make('amount')
                            ->label('Amount Paid')
                            ->numeric()
                            ->required()
                            ->prefix('$'),
                        Select::make('method')
                            ->label('Payment Method')
                            ->options([
                                'cash' => 'Cash',
                                'credit_card' => 'Credit Card',
                                'bank_transfer' => 'Bank Transfer',
                                'paypal' => 'PayPal',
                                'stripe' => 'Stripe',
                            ])
                            ->required(),
                        TextInput::make('transaction_id')
                            ->label('Transaction ID'),
                    ])
                    ->visible(fn ($record) => $record->payment_status !== 'paid')
                    ->action(function ($record, array $data) {
                        $record->markAsPaid(
                            $data['amount'],
                            $data['method'],
                            $data['transaction_id'] ?? null
                        );
                    })
                    ->successNotificationTitle('Payment recorded successfully'),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    BulkAction::make('confirm')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $records->each->confirm();
                        })
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
