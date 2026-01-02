<?php

namespace App\Filament\Resources\Destinations\Actions;

use Filament\Actions\Action as ActionsAction;
use Filament\Forms\Components\Actions\Action;
use Filament\Schemas\Components\Actions;
use Illuminate\Support\Facades\Route;

class UnsplashPickerAction
{
    public static function make(): Actions
    {
        return Action::make('unsplash_picker')
            ->label('Add from Unsplash')
            ->icon('heroicon-o-photo')
            ->color('success')
            ->action(function ($livewire) {
                $destinationId = $livewire->record->id ?? null;
                
                if (!$destinationId) {
                    \Filament\Notifications\Notification::make()
                        ->title('Please save the destination first')
                        ->warning()
                        ->send();
                    return;
                }

                $url = route('unsplash.picker', ['destination_id' => $destinationId]);
                
                // Open in new window
                $livewire->js("window.open('$url', 'unsplash', 'width=1200,height=800')");
            });
    }
}
