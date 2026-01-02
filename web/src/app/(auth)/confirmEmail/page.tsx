"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";


export default function ConfirmEmail() {
const searchParams = useSearchParams();
const email = searchParams.get('email');
const code = searchParams.get('code');
const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
const [message, setMessage] = useState('');

 const confirmEmailUrl = `${process.env.NEXT_PUBLIC_API_URL}/account/ConfirmEmail?email=${encodeURIComponent(email || '')}&code=${encodeURIComponent(code || '')}`;
 
 const handleConfirmEmail = async () => {

  try {
    const response = await fetch(confirmEmailUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok) {
      console.error('Email confirmation failed:', data);
      setStatus('error');
      setMessage(data.error || 'Email confirmation failed');
      throw new Error(data.error || 'Network response was not ok');
    }
    
    console.log('Email confirmed successfully:', data);
    setStatus('success');
    setMessage('Email confirmed successfully! You can now log in.');
  } catch (error) {
    console.error('Error confirming email:', error);
    setStatus('error');
    setMessage(error instanceof Error ? error.message : 'An error occurred');
  }
}

useEffect(() => {
  if (email && code) {
    handleConfirmEmail();
  } else {
    console.error('Email or code is missing in the URL parameters');
    setStatus('error');
    setMessage('Email or confirmation code is missing from the URL');
  }
}, [email, code]);

  return (
    <div className="lg:w-1/2 w-full flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Email Confirmation</h1>
        
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Confirming your email...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-green-600 dark:text-green-400 font-semibold">{message}</p>
            <Link 
              href="/signin" 
              className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-light-600 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <p className="text-red-600 dark:text-red-400 font-semibold">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Please check your email for a new confirmation link or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
