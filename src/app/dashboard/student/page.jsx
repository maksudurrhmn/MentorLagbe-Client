'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import useAuth from '@/hooks/useAuth';

function StudentDashboardContent() {
  const { user } = useAuth();

  return (
    <main className="min-h-dvh bg-background px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>

        <p className="mt-3 text-muted">Welcome back, {user?.name}!</p>
      </div>
    </main>
  );
}

export default function StudentDashboard() {
  return (
    <AuthGuard allowedRoles={['student']}>
      <StudentDashboardContent />
    </AuthGuard>
  );
}
