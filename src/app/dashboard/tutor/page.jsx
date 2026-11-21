'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import useAuth from '@/hooks/useAuth';

function TutorDashboardContent() {
  const { user } = useAuth();

  return (
    <main className="px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-foreground">Tutor Dashboard</h1>

        <p className="mt-3 text-muted">Welcome back, {user?.name}!</p>
      </div>
    </main>
  );
}

export default function TutorDashboard() {
  return (
    <AuthGuard allowedRoles={['tutor']}>
      <TutorDashboardContent />
    </AuthGuard>
  );
}
