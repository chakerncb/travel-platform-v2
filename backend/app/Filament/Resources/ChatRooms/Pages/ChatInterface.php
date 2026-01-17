<?php

namespace App\Filament\Resources\ChatRooms\Pages;

use App\Filament\Resources\ChatRooms\ChatRoomResource;
use App\Models\ChatMessage;
use App\Models\ChatRoom;
use App\Events\NewChatMessage;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Resources\Pages\Page;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On;

class ChatInterface extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string $resource = ChatRoomResource::class;

    protected static ?string $title = 'Chat';

    protected static ?string $navigationLabel = 'Chat';

    public ?int $selectedRoomId = null;
    
    public string $message = '';

    protected function getPollingInterval(): ?string
    {
        return null; // Disabled polling - using real-time broadcasting instead
    }

    public function getView(): string
    {
        return 'filament.pages.chat-interface';
    }

    public function mount(): void
    {
        $firstRoom = ChatRoom::with(['user', 'latestMessage'])
            ->orderBy('last_message_at', 'desc')
            ->first();
        
        if ($firstRoom) {
            $this->selectedRoomId = $firstRoom->id;
            $this->markMessagesAsRead();
        }
    }

    // REMOVE THE form() METHOD - It's causing the issue
    // Instead, use getFormSchema()
    protected function getFormSchema(): array
    {
        return [
            Textarea::make('message')
                ->label('')
                ->required()
                ->maxLength(1000)
                ->rows(1)
                ->placeholder('Type your message here...')
                ->autofocus()
                ->extraAttributes([
                    'class' => 'resize-none',
                ]),
        ];
    }

    public function getChatRooms()
    {
        return ChatRoom::with(['user', 'latestMessage', 'unreadMessages'])
            ->orderBy('last_message_at', 'desc')
            ->get();
    }

    public function getMessages()
    {
        if (!$this->selectedRoomId) {
            return collect([]);
        }

        return ChatMessage::with(['user'])
            ->where('chat_room_id', $this->selectedRoomId)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function getSelectedRoom()
    {
        if (!$this->selectedRoomId) {
            return null;
        }

        return ChatRoom::with(['user'])->find($this->selectedRoomId);
    }

    public function selectRoom(int $roomId): void
    {
        $this->selectedRoomId = $roomId;
        $this->markMessagesAsRead();
        $this->message = '';
    }

    public function sendMessage(): void
    {
        if (empty(trim($this->message)) || !$this->selectedRoomId) {
            return;
        }

        $message = ChatMessage::create([
            'chat_room_id' => $this->selectedRoomId,
            'user_id' => Auth::id(),
            'message' => trim($this->message),
            'is_from_admin' => true,
        ]);

        $room = ChatRoom::find($this->selectedRoomId);
        if ($room) {
            $room->update(['last_message_at' => now()]);
        }

        try {
            broadcast(new NewChatMessage($message))->toOthers();
        } catch (\Exception $e) {
            // Silently fail if broadcasting doesn't work
        }

        // Clear the message
        $this->message = '';
        
        // Refresh the component
        $this->dispatch('messagesSent');
    }

    protected function markMessagesAsRead(): void
    {
        if (!$this->selectedRoomId) {
            return;
        }

        ChatMessage::where('chat_room_id', $this->selectedRoomId)
            ->where('is_from_admin', false)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    #[On('refresh-messages')]
    public function refreshMessages(): void
    {
        $this->markMessagesAsRead();
    }

    #[On('echo-private:chat-room.{selectedRoomId},new.message')]
    public function handleNewMessage($data): void
    {
        // Mark messages as read when new message arrives
        $this->markMessagesAsRead();
        
        // Refresh the component to show new messages
        $this->dispatch('newMessageReceived');
    }

    #[On('refresh-rooms')]
    public function refreshRooms(): void
    {
        // Just trigger a re-render to update the rooms list
    }
}