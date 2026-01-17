<?php

namespace App\Filament\Resources\Blogs\Pages;

use App\Filament\Resources\Blogs\BlogCommentResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions;

class ListBlogComments extends ListRecords
{
    protected static string $resource = BlogCommentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('approve_all_pending')
                ->label('Approve All Pending')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->action(function () {
                    \App\Models\BlogComment::where('status', 'pending')
                        ->update(['status' => 'approved']);
                    
                    $this->getTable()->deselectAllRecordsWhenFiltered();
                    
                    \Filament\Notifications\Notification::make()
                        ->title('All pending comments approved')
                        ->success()
                        ->send();
                }),
        ];
    }
}
