'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  CheckCircle2,
  Clock3,
  CreditCard,
  Search,
  Plus,
  BookOpen,
  Inbox,
} from 'lucide-react';

import AuthGuard from '@/components/auth/AuthGuard';
import useAuth from '@/hooks/useAuth';

const stats = [
  {
    label: 'Total Applications',
    value: '—',
    description: 'All applications you submitted',
    icon: ClipboardList,
  },
  {
    label: 'Accepted Applications',
    value: '—',
    description: 'Applications accepted by tutors',
    icon: CheckCircle2,
  },
  {
    label: 'Pending Applications',
    value: '—',
    description: 'Awaiting a tutor’s decision',
    icon: Clock3,
  },
  {
    label: 'Current Plan',
    value: '—',
    description: 'Your active subscription plan',
    icon: CreditCard,
  },
];

const quickActions = [
  {
    title: 'Find Tutors',
    description: 'Discover qualified tutors for your needs.',
    href: '/tutors',
    icon: Search,
  },
  {
    title: 'Explore Tuitions',
    description: 'Browse available tuition opportunities.',
    href: '/tuitions',
    icon: BookOpen,
  },
  {
    title: 'Post a Tuition',
    description: 'Create and manage your tuition requirements.',
    href: '/dashboard/student/tuitions',
    icon: Plus,
  },
];

function StudentDashboardContent() {
  const { user } = useAuth();

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Section */}
        <section>
          <p className="text-sm font-medium text-primary">Student Workspace</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {firstName}!
          </h1>

          <p className="mt-2 text-sm text-muted">Here's an overview of your tuition activities.</p>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>

            <p className="mt-1 text-sm text-muted">Keep track of your activity on MentorLagbe.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted">{stat.label}</p>

                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon size={20} />
                    </div>
                  </div>

                  <p className="mt-4 text-3xl font-bold text-foreground">{stat.value}</p>

                  <p className="mt-1 text-xs text-muted">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>

            <p className="mt-1 text-sm text-muted">Get started with your next step.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{action.title}</h3>

                    <p className="mt-1 text-sm text-muted">{action.description}</p>
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-muted transition-colors group-hover:text-primary"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>

              <p className="mt-1 text-sm text-muted">
                Your latest tuition and application updates.
              </p>
            </div>

            <Inbox size={22} className="text-muted" />
          </div>

          <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-4 py-10 text-center">
            <div className="rounded-full bg-background p-3">
              <Inbox size={24} className="text-muted" />
            </div>

            <h3 className="mt-3 font-medium text-foreground">No recent activity</h3>

            <p className="mt-1 max-w-sm text-sm text-muted">
              Your latest applications and tuition updates will appear here.
            </p>

            <Link
              href="/tutors"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Explore tutors
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
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
