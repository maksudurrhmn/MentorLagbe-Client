'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function TestApiPage() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const getToken = async () => {
    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setMessage(error?.message || 'Unable to retrieve JWT token.');
        return;
      }

      setToken(data.token);
      setMessage('JWT token retrieved successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-2xl font-bold">JWT Token Test</h1>

      <button onClick={getToken} className="rounded-lg bg-blue-600 px-5 py-3 text-white">
        Get JWT Token
      </button>

      {message && <p className="mt-4">{message}</p>}

      {token && (
        <textarea readOnly value={token} className="mt-4 min-h-40 w-full rounded-lg border p-3" />
      )}
    </main>
  );
}
