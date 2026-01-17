<?php

namespace App\Filament\Resources\Newsletters\Tables;

use App\Models\NewsletterSubscriber;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Filament\Actions\Action;

class SubscribersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                    // ->default('N/A'),
                
                IconColumn::make('is_subscribed')
                    ->boolean()
                    ->label('Subscribed')
                    ->sortable(),
                
                TextColumn::make('subscribed_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Subscribed Date'),
                
                TextColumn::make('unsubscribed_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Unsubscribed Date'),
                    // ->default('N/A'),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('is_subscribed')
                    ->label('Subscription Status')
                    ->placeholder('All subscribers')
                    ->trueLabel('Subscribed')
                    ->falseLabel('Unsubscribed'),
            ])
            ->actions([
                Action::make('toggle_subscription')
                    ->icon(fn (NewsletterSubscriber $record) => $record->is_subscribed ? 'heroicon-o-x-circle' : 'heroicon-o-check-circle')
                    ->color(fn (NewsletterSubscriber $record) => $record->is_subscribed ? 'danger' : 'success')
                    ->label(fn (NewsletterSubscriber $record) => $record->is_subscribed ? 'Unsubscribe' : 'Subscribe')
                    ->requiresConfirmation()
                    ->action(function (NewsletterSubscriber $record) {
                        if ($record->is_subscribed) {
                            $record->unsubscribe();
                            \Filament\Notifications\Notification::make()
                                ->title('Subscriber Unsubscribed')
                                ->success()
                                ->send();
                        } else {
                            $record->subscribe();
                            \Filament\Notifications\Notification::make()
                                ->title('Subscriber Re-subscribed')
                                ->success()
                                ->send();
                        }
                    }),
                
                ActionGroup::make([
                    EditAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
