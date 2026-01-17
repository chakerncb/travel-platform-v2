'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { initializeEcho, getEcho } from '@/src/lib/echo'

interface Message {
  id: number
  message: string
  user_id: number
  user_name: string
  is_from_admin: boolean
  is_read: boolean
  created_at: string
}

interface ChatRoom {
  id: number
  user_id: number
  is_active: boolean
  last_message_at: string | null
}

export default function FloatingChat() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [buttonHover, setButtonHover] = useState(false)
  const [closeHover, setCloseHover] = useState(false)
  const [sendHover, setSendHover] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  // Debug logging
  useEffect(() => {
    console.log('FloatingChat - Session status:', status)
    console.log('FloatingChat - Session data:', session)
  }, [session, status])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat room and Echo when user is logged in
  useEffect(() => {
    if (session?.user && session?.accessToken) {
      initializeChatRoom()
      initializeEcho(session.accessToken as string)
    }
  }, [session])

  // Set up Echo listener when chat room is available
  useEffect(() => {
    if (chatRoom && session?.accessToken) {
      const echo = getEcho()
      if (echo) {
        echo.private(`chat-room.${chatRoom.id}`)
          .listen('.new.message', (e: any) => {
            const message: Message = {
              id: e.id,
              message: e.message,
              user_id: e.user_id,
              user_name: e.user_name,
              is_from_admin: e.is_from_admin,
              is_read: e.is_read,
              created_at: e.created_at,
            }
            setMessages(prev => [...prev, message])
            
            // Increment unread count if chat is closed and message is from admin
            if (!isOpen && message.is_from_admin) {
              setUnreadCount(prev => prev + 1)
            }
          })
      }

      return () => {
        if (echo && chatRoom) {
          echo.leave(`chat-room.${chatRoom.id}`)
        }
      }
    }
  }, [chatRoom, session, isOpen])

  // Fetch unread count periodically
  useEffect(() => {
    if (session?.accessToken && !isOpen) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000) // Every 30 seconds
      return () => clearInterval(interval)
    }
  }, [session, isOpen])

  const initializeChatRoom = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/chat/room`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setChatRoom(data.chat_room)
      }
    } catch (error) {
      console.error('Error initializing chat room:', error)
    }
  }

  const fetchMessages = async () => {
    if (!chatRoom) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`${apiUrl}/v1/chat/room/${chatRoom.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/chat/unread-count`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !chatRoom || isSending) return

    setIsSending(true)
    try {
      const response = await fetch(`${apiUrl}/v1/chat/room/${chatRoom.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const markAsRead = async () => {
    if (!chatRoom) return
    
    try {
      await fetch(`${apiUrl}/v1/chat/room/${chatRoom.id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const toggleChat = async () => {
    if (!isOpen && chatRoom) {
      await fetchMessages()
      await markAsRead()
    }
    setIsOpen(!isOpen)
  }

  // Don't show chat if user is not logged in
  if (!session?.user) {
    return null
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  // Styles
  const styles = {
    floatingButton: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      animation: 'fadeInSlide 0.3s ease-out',
    },
    chatButton: {
      background: buttonHover 
        ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      padding: '16px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      boxShadow: buttonHover 
        ? '0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.3)'
        : '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2)',
      transition: 'all 0.3s ease',
      transform: buttonHover ? 'scale(1.1)' : 'scale(1)',
      position: 'relative' as const,
    },
    unreadBadge: {
      position: 'absolute' as const,
      top: '-4px',
      right: '-4px',
      background: '#ef4444',
      color: 'white',
      fontSize: '11px',
      fontWeight: 'bold',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    chatContainer: {
      position: 'fixed' as const,
      bottom: '24px',
      right: '24px',
      width: '384px',
      zIndex: 1000,
      animation: 'fadeInSlide 0.3s ease-out',
    },
    chatBox: {
      background: 'white',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
    },
    header: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      backdropFilter: 'blur(10px)',
    },
    onlineIndicator: {
      position: 'absolute' as const,
      bottom: 0,
      right: 0,
      width: '12px',
      height: '12px',
      background: '#10b981',
      borderRadius: '50%',
      border: '2px solid #2563eb',
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      fontWeight: 600,
      fontSize: '16px',
      margin: 0,
    },
    headerSubtitle: {
      fontSize: '12px',
      opacity: 0.9,
      margin: 0,
    },
    closeButton: {
      background: closeHover ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      color: closeHover ? 'white' : 'rgba(255, 255, 255, 0.9)',
      border: 'none',
      borderRadius: '50%',
      padding: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    messagesContainer: {
      padding: '16px',
      height: '384px',
      overflowY: 'auto' as const,
      background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)',
      scrollBehavior: 'smooth' as const,
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #e5e7eb',
      borderTopColor: '#3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    spinnerInner: {
      width: '24px',
      height: '24px',
      background: '#3b82f6',
      borderRadius: '50%',
      animation: 'pulse 2s ease-in-out infinite',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#9ca3af',
    },
    emptyIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
    },
    emptyText: {
      fontSize: '14px',
      fontWeight: 500,
      margin: '8px 0 4px 0',
    },
    emptySubtext: {
      fontSize: '12px',
      margin: 0,
    },
    messagesList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    messageWrapper: (isOwn: boolean) => ({
      display: 'flex',
      alignItems: 'flex-end',
      gap: '8px',
      flexDirection: isOwn ? 'row-reverse' as const : 'row' as const,
      animation: 'fadeInUp 0.3s ease-out',
    }),
    messageAvatar: (isOwn: boolean) => ({
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: isOwn 
        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
      color: isOwn ? 'white' : '#374151',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 600,
      flexShrink: 0,
    }),
    messageContent: (isOwn: boolean) => ({
      display: 'flex',
      flexDirection: 'column' as const,
      maxWidth: '75%',
      alignItems: isOwn ? 'flex-end' : 'flex-start',
    }),
    messageBubble: (isOwn: boolean) => ({
      borderRadius: '16px',
      padding: '10px 16px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      background: isOwn 
        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        : 'white',
      color: isOwn ? 'white' : '#1f2937',
      border: isOwn ? 'none' : '1px solid #e5e7eb',
      borderBottomLeftRadius: !isOwn ? '4px' : '16px',
      borderBottomRightRadius: isOwn ? '4px' : '16px',
    }),
    messageText: {
      fontSize: '14px',
      lineHeight: '1.5',
      wordBreak: 'break-word' as const,
      margin: 0,
    },
    messageTime: {
      fontSize: '11px',
      color: '#9ca3af',
      marginTop: '4px',
      paddingLeft: '4px',
      paddingRight: '4px',
    },
    inputContainer: {
      padding: '16px',
      borderTop: '1px solid #e5e7eb',
      background: 'white',
    },
    inputForm: {
      display: 'flex',
      gap: '8px',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      fontSize: '14px',
      border: inputFocused ? '2px solid #3b82f6' : '2px solid #e5e7eb',
      background: inputFocused ? 'white' : '#f9fafb',
      color: '#1f2937',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxShadow: inputFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
    },
    sendButton: {
      background: sendHover && !isSending && newMessage.trim()
        ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      cursor: !newMessage.trim() || isSending ? 'not-allowed' : 'pointer',
      opacity: !newMessage.trim() || isSending ? 0.5 : 1,
      transition: 'all 0.2s ease',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: sendHover && !isSending && newMessage.trim()
        ? '0 4px 12px rgba(59, 130, 246, 0.3)'
        : '0 2px 4px rgba(59, 130, 246, 0.2)',
      transform: sendHover && !isSending && newMessage.trim() ? 'scale(0.98)' : 'scale(1)',
    },
    sendSpinner: {
      width: '16px',
      height: '16px',
      border: '2px solid white',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
    },
  }

  return (
    <>
      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
          background: #3b82f6;
          borderRadius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>

      {/* Open Chat Button */}
      {!isOpen && (
        <div style={styles.floatingButton}>
          <button
            onClick={toggleChat}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            style={styles.chatButton}
            title="Chat with Admin"
            aria-label="Open chat"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style={{ width: '24px', height: '24px' }}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            
            {unreadCount > 0 && (
              <span style={styles.unreadBadge}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Container */}
      {isOpen && (
        <div style={styles.chatContainer}>
          <div style={styles.chatBox}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerContent}>
                <div style={styles.avatar}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div style={styles.onlineIndicator} />
                </div>
                <div style={styles.headerText}>
                  <p style={styles.headerTitle}>Admin Support</p>
                  <p style={styles.headerSubtitle}>We're here to help</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                onMouseEnter={() => setCloseHover(true)}
                onMouseLeave={() => setCloseHover(false)}
                style={styles.closeButton}
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div style={styles.messagesContainer} className="chat-messages">
              {isLoading ? (
                <div style={styles.loadingContainer}>
                  <div style={{ position: 'relative' }}>
                    <div style={styles.spinner} />
                    <div style={styles.spinnerInner} />
                  </div>
                  <p style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '40px', height: '40px', color: '#3b82f6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p style={styles.emptyText}>No messages yet</p>
                  <p style={styles.emptySubtext}>Start a conversation with our support team</p>
                </div>
              ) : (
                <div style={styles.messagesList}>
                  {messages.map((message, index) => {
                    const isOwn = message.user_id === session?.user?.id
                    const showAvatar = index === 0 || messages[index - 1].user_id !== message.user_id
                    
                    return (
                      <div key={message.id} style={styles.messageWrapper(isOwn)}>
                        {showAvatar ? (
                          <div style={styles.messageAvatar(isOwn)}>
                            {isOwn ? 'You' : '🤖'}
                          </div>
                        ) : (
                          <div style={{ width: '32px' }} />
                        )}
                        
                        <div style={styles.messageContent(isOwn)}>
                          <div style={styles.messageBubble(isOwn)}>
                            <p style={styles.messageText}>{message.message}</p>
                          </div>
                          <span style={styles.messageTime}>
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div style={styles.inputContainer}>
              <form onSubmit={sendMessage} style={styles.inputForm}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Type your message..."
                  style={styles.input}
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  onMouseEnter={() => setSendHover(true)}
                  onMouseLeave={() => setSendHover(false)}
                  style={styles.sendButton}
                  aria-label="Send message"
                >
                  {isSending ? (
                    <div style={styles.sendSpinner} />
                  ) : (
                    <>
                      <span>Send</span>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', transform: 'rotate(90deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}