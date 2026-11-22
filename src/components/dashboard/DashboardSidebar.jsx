'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  FileText,
  BookOpen,
  CreditCard,
  UserRound,
  Users,
  ClipboardList,
  Wallet,
  X,
  PlusCircle,
} from 'lucide-react';

import useAuth from '@/hooks/useAuth';

const navigation = {
  student: [
    {
      label: 'Overview',
      href: '/dashboard/student',
      icon: LayoutDashboard,
    },
    {
      label: 'Find Tuitions',
      href: '/tuitions',
      icon: Search,
    },
    {
      label: 'My Applications',
      href: '/dashboard/student/applications',
      icon: FileText,
    },
    {
      label: 'Payments',
      href: '/dashboard/student/payments',
      icon: CreditCard,
    },
    {
      label: 'My Profile',
      href: '/dashboard/profile',
      icon: UserRound,
    },
  ],

  tutor: [
    {
      label: 'Overview',
      href: '/dashboard/tutor',
      icon: LayoutDashboard,
    },
    {
      label: 'My Tuitions',
      href: '/dashboard/tutor/tuitions',
      icon: BookOpen,
    },
    {
      label: 'Applicants',
      href: '/dashboard/tutor/applications',
      icon: Users,
    },
    {
      label: 'Payments',
      href: '/dashboard/tutor/payments',
      icon: CreditCard,
    },
    {
      label: 'My Profile',
      href: '/dashboard/profile',
      icon: UserRound,
    },
  ],

  admin: [
    {
      label: 'Overview',
      href: '/dashboard/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Manage Users',
      href: '/dashboard/admin/users',
      icon: Users,
    },
    {
      label: 'Manage Tuitions',
      href: '/dashboard/admin/tuitions',
      icon: BookOpen,
    },
    {
      label: 'Payments & Transactions',
      href: '/dashboard/admin/payments',
      icon: CreditCard,
    },
    {
      label: 'My Profile',
      href: '/dashboard/profile',
      icon: UserRound,
    },
  ],
};

export default function DashboardSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { role } = useAuth();

  const navItems = navigation[role] || [];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-72 shrink-0 flex-col border-r border-border bg-surface transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-auto lg:w-64 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <Link
            href="/"
            onClick={onClose}
            className="text-xl font-bold tracking-tight text-primary"
          >
            MentorLagbe
          </Link>

          <p className="mt-1 text-xs font-medium capitalize text-muted">{role} dashboard</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Menu</p>

        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== `/dashboard/${role}` && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:bg-background hover:text-foreground'
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-center text-xs text-muted">MentorLagbe Dashboard</p>
      </div>
    </aside>
  );
}
