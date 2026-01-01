<?php

namespace App\Filament\Resources\Tours\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ToursTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                
                TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn ($state) => ucfirst(str_replace('_', ' ', $state)))
                    ->color(fn ($state) => match($state) {
                        'pre_prepared' => 'success',
                        'custom' => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
                
                TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),
                
                TextColumn::make('duration_days')
                    ->label('Duration')
                    ->formatStateUsing(fn ($state) => $state . ' days')
                    ->sortable(),
                
                TextColumn::make('difficulty_level')
                    ->label('Difficulty')
                    ->badge()
                    ->formatStateUsing(fn ($state) => ucfirst($state))
                    ->color(fn ($state) => match($state) {
                        'easy' => 'success',
                        'moderate' => 'info',
                        'challenging' => 'warning',
                        'difficult' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                
                TextColumn::make('max_group_size')
                    ->label('Max Group')
                    ->formatStateUsing(fn ($state) => $state ? $state . ' people' : 'Unlimited')
                    ->toggleable(),
                
                IconColumn::make('is_eco_friendly')
                    ->label('Eco Friendly')
                    ->boolean()
                    ->toggleable(),
                
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
                
                TextColumn::make('start_date')
                    ->date()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('end_date')
                    ->date()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->label('Tour Type')
                    ->options([
                        'pre_prepared' => 'Pre-Prepared',
                        'custom' => 'Custom',
                    ]),
                
                SelectFilter::make('difficulty_level')
                    ->label('Difficulty')
                    ->options([
                        'easy' => 'Easy',
                        'moderate' => 'Moderate',
                        'challenging' => 'Challenging',
                        'difficult' => 'Difficult',
                    ]),
                
                SelectFilter::make('is_eco_friendly')
                    ->label('Eco Friendly')
                    ->options([
                        '1' => 'Yes',
                        '0' => 'No',
                    ]),
                
                SelectFilter::make('is_active')
                    ->label('Status')
                    ->options([
                        '1' => 'Active',
                        '0' => 'Inactive',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
