<?php

namespace App\Filament\Resources\Blogs\Tables;

use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class BlogCommentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('blog.title')
                    ->label('Blog Post')
                    ->searchable()
                    ->sortable()
                    ->limit(40),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: false),

                TextColumn::make('comment')
                    ->limit(50)
                    ->searchable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('parent_id')
                    ->label('Type')
                    ->formatStateUsing(fn ($state) => $state ? 'Reply' : 'Comment')
                    ->badge()
                    ->color(fn ($state) => $state ? 'info' : 'primary'),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),

                SelectFilter::make('type')
                    ->options([
                        'comment' => 'Comments',
                        'reply' => 'Replies',
                    ])
                    ->query(function ($query, $state) {
                        if ($state['value'] === 'comment') {
                            return $query->whereNull('parent_id');
                        } elseif ($state['value'] === 'reply') {
                            return $query->whereNotNull('parent_id');
                        }
                    }),
            ])
            ->actions([
                ActionGroup::make([
                    EditAction::make(),
                    DeleteAction::make(),
                ]),
            ])
            ->bulkActions([
                //
            ])
            ->defaultSort('created_at', 'desc');
    }
}
