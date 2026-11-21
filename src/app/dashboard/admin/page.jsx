'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import useAuth from '@/hooks/useAuth';

function AdminDashboardContent() {
  const { user } = useAuth();

  return (
    <main className="px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>

        <p className="mt-3 text-muted">Welcome back, {user?.name}!</p>
      </div>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <AdminDashboardContent />
    </AuthGuard>
  );
}
