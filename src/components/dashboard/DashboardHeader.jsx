'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut, UserRound } from 'lucide-react';

import ThemeToggle from '@/components/shared/ThemeToggle';
import useAuth from '@/hooks/useAuth';
import { signOut } from '@/lib/auth-client';

const pageTitles = {
  student: {
    '/dashboard/student': 'Student Overview',
  },
  tutor: {
    '/dashboard/tutor': 'Tutor Overview',
  },
  admin: {
    '/dashboard/admin': 'Admin Overview',
  },
};

export default function DashboardHeader({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();

  const title = pageTitles[role]?.[pathname] || 'Dashboard';

  const handleLogout = async () => {
    await signOut();
    router.replace('/signin');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur-lg lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {/* Hamburger button here */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-foreground lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <p className="hidden text-xs text-muted sm:block">
            Welcome to your MentorLagbe workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="hidden items-center gap-2 border-l border-border pl-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound size={18} />
          </div>

          <div className="hidden md:block">
            <p className="max-w-32 truncate text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs capitalize text-muted">{role}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
