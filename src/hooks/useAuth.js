'use client';

import { useSession } from '@/lib/auth-client';

export default function useAuth() {
  const { data: session, isPending, error, refetch } = useSession();

  return {
    session,
    user: session?.user ?? null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    role: session?.user?.role ?? null,
    error,
    refetch,
  };
}
