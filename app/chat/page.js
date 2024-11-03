// app/chat/page.js
'use client';

import Chat from '../components/Chat';
import LogoutButton from '../components/LogoutButton'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/check', { credentials: 'include' });
      if (!res.ok) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div>
      <h1>Real-Time Chat with Sentiment Analysis</h1>
      <Chat />
      <LogoutButton />
    </div>
  );
}