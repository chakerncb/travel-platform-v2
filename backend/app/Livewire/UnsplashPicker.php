<?php

namespace App\Livewire;

use App\Models\DestinationImage;
use App\Services\UnsplashService;
use Livewire\Component;
use Filament\Notifications\Notification;

class UnsplashPicker extends Component
{
    public $destinationId;
    public $searchQuery = '';
    public $photos = [];
    public $currentPage = 1;
    public $totalPages = 1;
    public $isLoading = false;
    public $showPicker = false;

    protected UnsplashService $unsplashService;

    protected $listeners = ['setDestinationId'];

    public function boot(UnsplashService $unsplashService)
    {
        $this->unsplashService = $unsplashService;
    }

    public function mount($destinationId = null, $record = null)
    {
        // Get destination ID from either parameter or record
        $this->destinationId = $destinationId ?? $record?->id ?? null;
    }

    public function setDestinationId($id)
    {
        $this->destinationId = $id;
    }

    public function togglePicker()
    {
        if (!$this->destinationId) {
            Notification::make()
                ->title('Please save the destination first')
                ->warning()
                ->send();
            return;
        }

        $this->showPicker = !$this->showPicker;
        
        if ($this->showPicker && empty($this->photos)) {
            $this->searchQuery = 'travel destination';
            $this->search();
        }
    }

    public function search()
    {
        if (empty($this->searchQuery)) {
            return;
        }

        $this->isLoading = true;
        $this->currentPage = 1;
        $this->loadPhotos();
    }

    public function loadPage($page)
    {
        $this->currentPage = $page;
        $this->loadPhotos();
    }

    private function loadPhotos()
    {
        $this->isLoading = true;

        try {
            $results = $this->unsplashService->searchPhotos($this->searchQuery, $this->currentPage, 12);
            
            $this->photos = $results['results'] ?? [];
            $this->totalPages = $results['total_pages'] ?? 1;
        } catch (\Exception $e) {
            Notification::make()
                ->title('Error loading images')
                ->body($e->getMessage())
                ->danger()
                ->send();
        } finally {
            $this->isLoading = false;
        }
    }

    public function selectPhoto($photoData)
    {
        try {
            // Download the photo
            $filePath = $this->unsplashService->downloadPhoto(
                $photoData['id'],
                $photoData['download_url']
            );

            if (!$filePath) {
                throw new \Exception('Failed to download image');
            }

            // Create destination image record
            DestinationImage::create([
                'destination_id' => $this->destinationId,
                'image_path' => $filePath,
                'is_primary' => false,
                'order' => DestinationImage::where('destination_id', $this->destinationId)->max('order') + 1,
                'photographer_name' => $photoData['photographer_name'],
                'photographer_url' => 'https://unsplash.com/@' . $photoData['photographer_username'],
                'source_url' => $photoData['unsplash_url'],
            ]);

            Notification::make()
                ->title('Image added successfully!')
                ->success()
                ->send();

            // Emit event to refresh the images repeater
            $this->dispatch('refreshImages');

        } catch (\Exception $e) {
            Notification::make()
                ->title('Error saving image')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function render()
    {
        return view('livewire.unsplash-picker');
    }
}
