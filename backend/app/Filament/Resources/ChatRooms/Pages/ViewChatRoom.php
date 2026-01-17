<?php

namespace App\Filament\Resources\ChatRooms\Pages;

use App\Filament\Resources\ChatRooms\ChatRoomResource;
use App\Models\ChatMessage;
use App\Events\NewChatMessage;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ViewEntry;
use Filament\Schemas\Schema;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Filament\Schemas\Components\Form;
use Illuminate\Support\Facades\Auth;
use Filament\Schemas\Components\Section;

class ViewChatRoom extends ViewRecord implements HasForms
{
    use InteractsWithForms;

    protected static string $resource = ChatRoomResource::class;
    
    protected static ?string $pollingInterval = '30s';

    public function mount(int | string $record): void
    {
        parent::mount($record);
        
        // Mark messages as read
        $this->record->messages()
            ->where('is_from_admin', false)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    public function messageForm(Form $form): Form
    {
        return $form
            ->schema([
                Textarea::make('message')
                    ->label('')
                    ->required()
                    ->maxLength(1000)
                    ->rows(3)
                    ->placeholder('Type your message here...')
                    ->columnSpanFull(),
            ])
            ->statePath('messageFormData');
    }

    public function infolist(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('User Information')
                    ->schema([
                        TextEntry::make('user.name')
                            ->label('Name'),
                        TextEntry::make('user.email')
                            ->label('Email'),
                        TextEntry::make('created_at')
                            ->label('Chat Started')
                            ->dateTime(),
                    ])
                    ->columns(3),
                Section::make('Conversation')
                    ->schema([
                        ViewEntry::make('messages')
                            ->view('filament.components.chat-messages')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('send')
                ->label('Send Message')
                ->icon('heroicon-o-paper-airplane')
                ->modalWidth('md')
                ->closeModalByClickingAway(false)
                ->form([
                    Textarea::make('message')
                        ->label('Message')
                        ->required()
                        ->maxLength(1000)
                        ->rows(3)
                        ->placeholder('Type your message here...')
                        ->autofocus(),
                ])
                ->action(function (array $data): void {
                    $this->sendMessage($data['message']);
                    $this->redirect(static::getUrl(['record' => $this->record->id]));
                })
                ->successNotificationTitle('Message sent successfully'),
        ];
    }

    public function sendMessage(string $messageText): void
    {
        if (trim($messageText) === '') {
            Notification::make()
                ->warning()
                ->title('Please enter a message')
                ->send();
            return;
        }

        $message = ChatMessage::create([
            'chat_room_id' => $this->record->id,
            'user_id' => Auth::id(),
            'message' => trim($messageText),
            'is_from_admin' => true,
        ]);

        $this->record->update(['last_message_at' => now()]);

        try {
            broadcast(new NewChatMessage($message))->toOthers();
        } catch (\Exception $e) {
            // Silently fail if broadcasting doesn't work
        }
    }

    public function getMessages()
    {
        return $this->record->messages()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();
    }
}
