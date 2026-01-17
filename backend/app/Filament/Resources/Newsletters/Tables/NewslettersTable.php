<?php

namespace App\Filament\Resources\Newsletters\Tables;

use App\Models\Newsletter;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Filament\Actions\Action;

class NewslettersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('subject')
                    ->searchable()
                    ->sortable()
                    ->limit(50)
                    ->wrap(),
                
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'draft' => 'gray',
                        'scheduled' => 'warning',
                        'sent' => 'success',
                        default => 'gray',
                    })
                    ->sortable(),
                
                TextColumn::make('recipients_count')
                    ->label('Recipients')
                    ->numeric()
                    ->sortable(),
                
                TextColumn::make('sent_count')
                    ->label('Sent')
                    ->numeric()
                    ->sortable(),
                
                TextColumn::make('failed_count')
                    ->label('Failed')
                    ->numeric()
                    ->sortable(),
                
                TextColumn::make('scheduled_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Scheduled')
                    ->toggleable(),
                
                TextColumn::make('sent_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Sent')
                    ->toggleable(),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'scheduled' => 'Scheduled',
                        'sent' => 'Sent',
                    ]),
            ])
            ->actions([
                Action::make('send')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (Newsletter $record) {
                        $controller = new \App\Http\Controllers\Api\NewsletterController();
                        $response = $controller->sendNewsletter(request(), $record->id);
                        
                        if ($response->getData()->status) {
                            \Filament\Notifications\Notification::make()
                                ->title('Newsletter Sent')
                                ->success()
                                ->body($response->getData()->message)
                                ->send();
                        } else {
                            \Filament\Notifications\Notification::make()
                                ->title('Failed to Send')
                                ->danger()
                                ->body($response->getData()->message)
                                ->send();
                        }
                    })
                    ->visible(fn (Newsletter $record) => !$record->isSent()),
                
                ActionGroup::make([
                    EditAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
