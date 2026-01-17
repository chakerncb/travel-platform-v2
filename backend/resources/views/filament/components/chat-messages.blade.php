<div class="space-y-4">
    @forelse($getRecord()->messages()->with('user')->orderBy('created_at', 'asc')->get() as $message)
        <div class="flex {{ $message->is_from_admin ? 'justify-end' : 'justify-start' }}">
            <div class="max-w-[70%] rounded-lg p-3 {{ $message->is_from_admin ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow' }}">
                @if(!$message->is_from_admin)
                    <p class="text-xs font-semibold mb-1 {{ $message->is_from_admin ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400' }}">
                        {{ $message->user->name }}
                    </p>
                @else
                    <p class="text-xs font-semibold mb-1 text-blue-100">
                        You (Admin)
                    </p>
                @endif
                <p class="text-sm whitespace-pre-wrap break-words">{{ $message->message }}</p>
                <p class="text-xs mt-1 {{ $message->is_from_admin ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400' }}">
                    {{ $message->created_at->format('M d, Y h:i A') }}
                </p>
            </div>
        </div>
    @empty
        <div class="text-center text-gray-500 py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="mt-2">No messages yet</p>
            <p class="text-sm mt-1">Start the conversation by sending a message</p>
        </div>
    @endforelse
</div>

