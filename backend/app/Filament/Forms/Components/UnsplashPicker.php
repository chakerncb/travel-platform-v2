<?php

namespace App\Filament\Forms\Components;

use App\Models\DestinationImage;
use App\Services\UnsplashService;
use Filament\Forms\Components\Field;
use Filament\Notifications\Notification;

class UnsplashPicker extends Field
{
    protected string $view = 'filament.forms.components.unsplash-picker';

    protected function setUp(): void
    {
        parent::setUp();

        $this->dehydrated(false);
        
        $this->afterStateHydrated(function (UnsplashPicker $component, $state) {
            // Component doesn't need state hydration
        });
    }

    public function getDestinationId(): ?int
    {
        return $this->getRecord()?->id;
    }
}
