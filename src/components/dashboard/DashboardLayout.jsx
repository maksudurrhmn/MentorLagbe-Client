'use client';

import { useState } from 'react';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AuthGuard allowedRoles={['student', 'tutor', 'admin']}>
      <div className="flex min-h-dvh bg-background text-foreground">
        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
          />
        )}

        <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <div className="min-w-0 flex-1">
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
