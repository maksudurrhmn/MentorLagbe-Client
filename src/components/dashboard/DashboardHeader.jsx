'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut, UserRound, LayoutDashboard, LoaderCircle } from 'lucide-react';

import ThemeToggle from '@/components/shared/ThemeToggle';
import useAuth from '@/hooks/useAuth';
import { signOut } from '@/lib/auth-client';

const getPageTitle = (pathname, role) => {
  const titles = [
    {
      path: `/dashboard/${role}`,
      title: `${role === 'admin' ? 'Admin' : role === 'tutor' ? 'Tutor' : 'Student'} Overview`,
    },
    { path: '/dashboard/profile', title: 'My Profile' },
    { path: '/dashboard/student/applications', title: 'My Applications' },
    { path: '/dashboard/student/payments', title: 'Payment History' },
    { path: '/dashboard/tutor/tuitions/new', title: 'Post New Tuition' },
    { path: '/dashboard/tutor/tuitions', title: 'My Tuitions' },
    { path: '/dashboard/tutor/applications', title: 'Applicants' },
    { path: '/dashboard/tutor/payments', title: 'Payment History' },
    { path: '/dashboard/admin/users', title: 'Manage Users' },
    { path: '/dashboard/admin/tuitions', title: 'Manage Tuitions' },
    { path: '/dashboard/admin/payments', title: 'Payments & Transactions' },
  ];

  const matched = titles.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`)
  );

  return matched?.title || 'Dashboard';
};

export default function DashboardHeader({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const title = getPageTitle(pathname, role);

  const userName = user?.name || 'User';
  const initials = userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await signOut();
      router.replace('/signin');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left: Menu and Page Title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-foreground lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={17} className="hidden shrink-0 text-primary sm:block" />

            <h1 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
              {title}
            </h1>
          </div>

          <p className="mt-0.5 hidden text-xs text-muted sm:block">
            Welcome to your MentorLagbe workspace
          </p>
        </div>
      </div>

      {/* Right: Theme and User Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />

        {/* User Information */}
        <div className="hidden items-center gap-2.5 border-l border-border pl-3 sm:flex">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/15">
            {initials || <UserRound size={17} />}
          </div>

          <div className="hidden min-w-0 md:block">
            <p className="max-w-36 truncate text-sm font-semibold text-foreground">{userName}</p>

            <p className="text-xs capitalize text-muted">{role || 'Member'}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          title="Logout"
          aria-label="Logout"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loggingOut ? <LoaderCircle size={18} className="animate-spin" /> : <LogOut size={18} />}
        </button>
      </div>
    </header>
  );
}
