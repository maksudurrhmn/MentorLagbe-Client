'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/api';

export default function TestApiPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testProtectedAPI = async () => {
    setLoading(true);
    setResult(null);

    try {
      const data = await apiRequest('/api/protected/student');

      setResult({
        status: 200,
        data,
      });
    } catch (error) {
      setResult({
        status: error.status || 'Error',
        data: { message: error.message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-foreground">Protected API Test</h1>

        <p className="mt-2 text-sm text-muted">
          Test communication between Better Auth and your Express backend.
        </p>

        <button
          onClick={testProtectedAPI}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Testing...' : 'Test Protected API'}
        </button>

        {result && (
          <pre className="mt-6 overflow-x-auto rounded-xl bg-background p-4 text-sm text-foreground">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}
