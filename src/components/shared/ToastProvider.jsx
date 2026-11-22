'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTheme } from 'next-themes';

export default function ToastProvider() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        removeDelay: 1000,
        style: {
          background: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f9fafb' : '#111827',
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: isDark ? '#1f2937' : '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: isDark ? '#1f2937' : '#ffffff',
          },
        },
      }}
    />
  );
}
