<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\ChatRoom;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Channel authorization for chat rooms
// Only the user who owns the chat room can listen to it
// Admin users can listen to all chat rooms
Broadcast::channel('chat-room.{chatRoomId}', function ($user, $chatRoomId) {
    $chatRoom = ChatRoom::find($chatRoomId);
    
    if (!$chatRoom) {
        return false;
    }
    
    // Check if user is the owner of the chat room or is an admin
    return (int) $user->id === (int) $chatRoom->user_id || $user->is_admin;
});
