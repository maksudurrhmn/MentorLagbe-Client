'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import useAuth from '@/hooks/useAuth';

export default function AuthGuard({ children, allowedRoles = [], redirectTo = '/' }) {
  const { isLoading, isAuthenticated, role } = useAuth();
  const router = useRouter();

  const hasPermission = allowedRoles.length === 0 || allowedRoles.includes(role);

  useEffect(() => {
    if (isLoading) return;

    // Redirect guests to login
    if (!isAuthenticated) {
      router.replace('/signin');
      return;
    }

    // Redirect users with insufficient permissions
    if (!hasPermission) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, hasPermission, redirectTo, router]);

  // Prevent protected content from flashing before authorization
  if (isLoading || !isAuthenticated || !hasPermission) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="text-sm font-medium text-muted">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return children;
}
