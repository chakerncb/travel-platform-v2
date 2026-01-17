<x-filament-panels::page>
    @push('scripts')
    <script>
        // Check Echo connection status
        document.addEventListener('DOMContentLoaded', function() {
            let echoCheckAttempts = 0;
            const maxAttempts = 10;
            
            const checkEcho = setInterval(() => {
                echoCheckAttempts++;
                
                if (typeof Echo !== 'undefined') {
                    console.log('Laravel Echo is connected and ready for real-time chat!');
                    clearInterval(checkEcho);
                    
                    // Show connection indicator
                    const indicator = document.getElementById('echo-status');
                    if (indicator) {
                        indicator.innerHTML = '<span style="color: #10b981;">● Connected</span>';
                    }
                } else if (echoCheckAttempts >= maxAttempts) {
                    console.error('Laravel Echo failed to initialize. Make sure Reverb server is running.');
                    clearInterval(checkEcho);
                    
                    // Show error indicator
                    const indicator = document.getElementById('echo-status');
                    if (indicator) {
                        indicator.innerHTML = '<span style="color: #ef4444;">● Disconnected</span>';
                    }
                }
            }, 500);
        });
    </script>
    @endpush

    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .chat-scrollbar::-webkit-scrollbar {
            width: 6px;
        }

        .chat-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }

        .chat-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }

        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .message-animate {
            animation: fadeIn 0.3s ease-out;
        }

        .badge-pulse {
            animation: pulse 2s ease-in-out infinite;
        }
    </style>

    <div style="display: grid; grid-template-columns: 320px 1fr; gap: 24px; height: calc(100vh - 12rem);">
        <!-- Left Sidebar - Chat Rooms List -->
        <div style="background: linear-gradient(to bottom, #ffffff, #f9fafb); border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb; overflow: hidden; display: flex; flex-direction: column;">
            <!-- Sidebar Header -->
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #000000 0%, #00000f 100%);">
                <h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 0; display: flex; align-items: center; gap: 10px; justify-content: space-between;">
                    <span style="display: flex; align-items: center; gap: 10px;">
                        <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Conversations
                    </span>
                    <span id="echo-status" style="font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.8);">
                        <span style="color: #fbbf24;">● Connecting...</span>
                    </span>
                </h3>
            </div>
            
            <!-- Conversations List -->
            <div class="chat-scrollbar" 
                 style="flex: 1; overflow-y: auto;"
                 x-data="{
                     listenForRoomUpdates() {
                         if (typeof Echo !== 'undefined') {
                             // Listen to all available chat rooms for updates
                             // This will refresh the sidebar when new messages arrive in any room
                             @foreach($this->getChatRooms() as $room)
                                 Echo.private('chat-room.{{ $room->id }}')
                                     .listen('.new.message', (e) => {
                                         console.log('Room list: New message in room {{ $room->id }}');
                                         // Refresh the entire component to update unread counts
                                         $wire.$refresh();
                                     });
                             @endforeach
                         }
                     }
                 }"
                 x-init="listenForRoomUpdates()">
                @forelse($this->getChatRooms() as $room)
                    <button
                        wire:click="selectRoom({{ $room->id }})"
                        wire:key="room-{{ $room->id }}"
                        style="width: 100%; padding: 16px; background: {{ $selectedRoomId === $room->id ? 'linear-gradient(to right, #eff6ff, #dbeafe)' : 'transparent' }}; border: none; border-bottom: 1px solid #f3f4f6; border-left: {{ $selectedRoomId === $room->id ? '4px solid #000000' : '4px solid transparent' }}; text-align: left; cursor: pointer; transition: all 0.2s ease;"
                        onmouseover="if({{ $selectedRoomId !== $room->id ? 'true' : 'false' }}) this.style.background='#f9fafb'"
                        onmouseout="if({{ $selectedRoomId !== $room->id ? 'true' : 'false' }}) this.style.background='transparent'"
                    >
                        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
                            <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1; min-width: 0;">
                                <!-- Avatar -->
                                <div style="flex-shrink: 0; width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #000000, #3e3d3d); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);">
                                    {{ strtoupper(substr($room->user->name, 0, 1)) }}
                                </div>
                                
                                <div style="flex: 1; min-width: 0;">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                        <p style="font-size: 14px; font-weight: 700; color: #111827; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            {{ $room->user->name }}
                                        </p>
                                        @if($room->unreadMessages->count() > 0)
                                            <span class="badge-pulse" style="display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 6px; font-size: 11px; font-weight: 700; color: white; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 10px; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);">
                                                {{ $room->unreadMessages->count() }}
                                            </span>
                                        @endif
                                    </div>
                                    <p style="font-size: 12px; color: #6b7280; margin: 0 0 4px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                        {{ $room->user->email }}
                                    </p>
                                    @if($room->latestMessage)
                                        <p style="font-size: 12px; color: #4b5563; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            {{ Str::limit($room->latestMessage->message, 45) }}
                                        </p>
                                    @endif
                                </div>
                            </div>
                            @if($room->latestMessage)
                                <span style="font-size: 11px; color: #9ca3af; white-space: nowrap; font-weight: 500;">
                                    {{ $room->latestMessage->created_at->diffForHumans() }}
                                </span>
                            @endif
                        </div>
                    </button>
                @empty
                    <div style="padding: 48px 32px; text-align: center; color: #6b7280;">
                        <svg style="margin: 0 auto; height: 48px; width: 48px; color: #9ca3af;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p style="margin-top: 12px; font-size: 14px;">No conversations yet</p>
                    </div>
                @endforelse
            </div>
        </div>

        <!-- Right Side - Chat Messages -->
        <div style="background: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb; overflow: hidden; display: flex; flex-direction: column;">
            @if($selectedRoomId && $this->getSelectedRoom())
                <!-- Chat Header -->
                <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #000000 0%, #000000 100%);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <!-- Avatar -->
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #000000, #000000); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4);">
                                {{ strtoupper(substr($this->getSelectedRoom()->user->name, 0, 1)) }}
                            </div>
                            <div>
                                <h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0; display: flex; align-items: center; gap: 8px;">
                                    {{ $this->getSelectedRoom()->user->name }}
                                    <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: rgba(16, 185, 129, 0.2); color: #10b981; backdrop-filter: blur(10px);">
                                        <span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 6px; animation: pulse 2s ease-in-out infinite;"></span>
                                        Active
                                    </span>
                                </h3>
                                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); margin: 0; display: flex; align-items: center; gap: 6px;">
                                    <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {{ $this->getSelectedRoom()->user->email }}
                                </p>
                            </div>
                        </div>
                        <div style="font-size: 12px; color: rgba(227, 32, 32, 0.8); font-weight: 500;">
                            <svg style="width: 16px; height: 16px; display: inline-block; margin-right: 4px; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Started {{ $this->getSelectedRoom()->created_at->diffForHumans() }}
                        </div>
                    </div>
                </div>

                <!-- Messages Area -->
                <div class="chat-scrollbar" 
                     style="flex: 1; overflow-y: auto; padding: 24px; background: linear-gradient(to bottom, #565656, #ffffff);" 
                     x-data="{ 
                         scrollToBottom() { 
                             this.$el.scrollTop = this.$el.scrollHeight 
                         },
                         listenToChannel() {
                             if (typeof Echo !== 'undefined' && @js($selectedRoomId)) {
                                 // Leave previous channel if exists
                                 if (window.currentChatChannel) {
                                     Echo.leave(window.currentChatChannel);
                                 }
                                 
                                 // Join the current chat room's private channel
                                 const channelName = 'chat-room.' + @js($selectedRoomId);
                                 window.currentChatChannel = channelName;
                                 
                                 Echo.private(channelName)
                                     .listen('.new.message', (e) => {
                                         console.log('New message received:', e);
                                         // Refresh Livewire component to show new message
                                         $wire.$refresh();
                                         setTimeout(() => this.scrollToBottom(), 100);
                                     });
                                 
                                 console.log('Listening to channel:', channelName);
                             }
                         }
                     }" 
                     x-init="scrollToBottom(); listenToChannel(); $wire.on('messagesSent', () => { setTimeout(() => scrollToBottom(), 100); $wire.$refresh(); }); $wire.on('newMessageReceived', () => { setTimeout(() => scrollToBottom(), 100) })"
                     id="messages-container">
                    @forelse($this->getMessages() as $message)
                        <div wire:key="message-{{ $message->id }}" class="message-animate" style="display: flex; justify-content: {{ $message->is_from_admin ? 'flex-end' : 'flex-start' }}; margin-bottom: 16px;">
                            <div style="max-width: 70%; border-radius: 18px; padding: 14px 18px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); {{ $message->is_from_admin ? 'background: linear-gradient(135deg, #000000, #000000); color: white;' : 'background: white; color: #111827; border: 1px solid #e5e7eb;' }}">
                                @if(!$message->is_from_admin)
                                    <p style="font-size: 12px; font-weight: 700; margin: 0 0 8px 0; color: #000000;">
                                        {{ $message->user->name }}
                                    </p>
                                @endif
                                <p style="font-size: 14px; margin: 0; white-space: pre-wrap; word-wrap: break-word; line-height: 1.6;">{{ $message->message }}</p>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                                    <p style="font-size: 11px; margin: 0; {{ $message->is_from_admin ? 'color: rgba(255, 255, 255, 0.8);' : 'color: #6b7280;' }}">
                                        {{ $message->created_at->format('M d, Y h:i A') }}
                                    </p>
                                    @if($message->is_from_admin)
                                        <svg style="width: 16px; height: 16px; color: rgba(255, 255, 255, 0.8);" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @empty
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6b7280;">
                            <div style="text-align: center;">
                                <svg style="margin: 0 auto; height: 64px; width: 64px; color: #d1d5db;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p style="margin-top: 16px; font-size: 16px; font-weight: 600;">No messages yet</p>
                                <p style="font-size: 14px; margin-top: 8px; color: #9ca3af;">Start the conversation!</p>
                            </div>
                        </div>
                    @endforelse
                </div>

                <!-- Message Input -->
                <div style="padding: 20px; border-top: 1px solid #e5e7eb; background: #ffffff;">
                    <form wire:submit="sendMessage" style="display: flex; gap: 12px;">
                        <div style="flex: 1;">
                            {{ $this->form }}
                        </div>
                        <button
                            type="submit"
                            style="display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; background: linear-gradient(135deg, #000000, #000000); color: white; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);"
                            onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 10px 15px -3px rgba(59, 130, 246, 0.4)'"
                            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 6px -1px rgba(59, 130, 246, 0.3)'"
                        >
                            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                            <span style="margin-left: 8px;">Send</span>
                        </button>
                    </form>
                </div>
            @else
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: linear-gradient(to bottom, #f9fafb, #ffffff);">
                    <div style="text-align: center; padding: 32px;">
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 96px; height: 96px; background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 50%; margin-bottom: 24px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2);">
                            <svg style="width: 48px; height: 48px; color: #000000;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p style="font-size: 20px; font-weight: 700; color: #374151; margin: 0 0 8px 0;">Welcome to Chat</p>
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">Select a conversation from the left to start messaging</p>
                    </div>
                </div>
            @endif
        </div>
    </div>
</x-filament-panels::page>