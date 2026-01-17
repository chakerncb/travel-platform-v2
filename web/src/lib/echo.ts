import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

// Make Pusher available globally
if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

let echoInstance: Echo | null = null;

export const initializeEcho = (token?: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const options = {
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'local-key',
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel: any) => {
      return {
        authorize: (socketId: string, callback: Function) => {
          fetch('http://localhost:8000/broadcasting/auth', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then(response => response.json())
            .then(data => {
              callback(null, data);
            })
            .catch(error => {
              callback(error);
            });
        },
      };
    },
  };

  echoInstance = new Echo(options);
  
  if (typeof window !== 'undefined') {
    window.Echo = echoInstance;
  }

  return echoInstance;
};

export const getEcho = () => {
  return echoInstance;
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
