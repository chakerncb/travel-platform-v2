<?php

namespace App\Filament\Resources\Blogs\Pages;

use App\Filament\Resources\Blogs\BlogCommentResource;
use Filament\Resources\Pages\EditRecord;
use Filament\Actions;

class EditBlogComment extends EditRecord
{
    protected static string $resource = BlogCommentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('approve')
                ->label('Approve')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->visible(fn ($record) => $record->status !== 'approved')
                ->action(function ($record) {
                    $record->update(['status' => 'approved']);
                    
                    \Filament\Notifications\Notification::make()
                        ->title('Comment approved')
                        ->success()
                        ->send();
                }),

            Actions\Action::make('reject')
                ->label('Reject')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->visible(fn ($record) => $record->status !== 'rejected')
                ->requiresConfirmation()
                ->action(function ($record) {
                    $record->update(['status' => 'rejected']);
                    
                    \Filament\Notifications\Notification::make()
                        ->title('Comment rejected')
                        ->success()
                        ->send();
                }),

            Actions\DeleteAction::make(),
        ];
    }
}
