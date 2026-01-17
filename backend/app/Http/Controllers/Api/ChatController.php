<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatRoom;
use App\Models\ChatMessage;
use App\Events\NewChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Get or create a chat room for the authenticated user
     */
    public function getOrCreateRoom(Request $request)
    {
        $user = Auth::user();
        
        // Find or create a chat room for this user
        $chatRoom = ChatRoom::firstOrCreate(
            ['user_id' => $user->id],
            ['is_active' => true]
        );

        return response()->json([
            'chat_room' => $chatRoom,
        ]);
    }

    /**
     * Get messages for a chat room
     */
    public function getMessages(Request $request, $roomId)
    {
        $user = Auth::user();
        $chatRoom = ChatRoom::findOrFail($roomId);

        // Ensure the user owns this chat room or is an admin
        if ($chatRoom->user_id !== $user->id && !$user->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = $chatRoom->messages()
            ->with('user:id,f_name,l_name')
            ->get();

        return response()->json([
            'messages' => $messages,
        ]);
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request, $roomId)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        $chatRoom = ChatRoom::findOrFail($roomId);

        // Ensure the user owns this chat room or is an admin
        if ($chatRoom->user_id !== $user->id && !$user->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Create the message
        $chatMessage = ChatMessage::create([
            'chat_room_id' => $chatRoom->id,
            'user_id' => $user->id,
            'message' => $request->message,
            'is_from_admin' => $user->is_admin ?? false,
        ]);

        // Update the chat room's last message time
        $chatRoom->update(['last_message_at' => now()]);

        // Broadcast the new message
        broadcast(new NewChatMessage($chatMessage))->toOthers();

        return response()->json([
            'message' => $chatMessage->load('user:id,f_name,l_name'),
        ], 201);
    }

    /**
     * Mark messages as read
     */
    public function markAsRead(Request $request, $roomId)
    {
        $user = Auth::user();
        $chatRoom = ChatRoom::findOrFail($roomId);

        // Ensure the user owns this chat room or is an admin
        if ($chatRoom->user_id !== $user->id && !$user->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Mark all unread messages as read (except those from the current user)
        $chatRoom->messages()
            ->where('user_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Get unread message count
     */
    public function getUnreadCount(Request $request)
    {
        $user = Auth::user();
        
        $chatRoom = ChatRoom::where('user_id', $user->id)->first();
        
        if (!$chatRoom) {
            return response()->json(['count' => 0]);
        }

        $count = $chatRoom->messages()
            ->where('user_id', '!=', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }
}
