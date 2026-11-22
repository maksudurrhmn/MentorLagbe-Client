'use client';

import { useCallback, useEffect, useState } from 'react';
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
  XCircle,
  Crown,
  RefreshCw,
  LoaderCircle,
} from 'lucide-react';

import AuthGuard from '@/components/auth/AuthGuard';
import useAuth from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api';

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-600',
  accepted: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
};

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
    title: 'My Applications',
    description: 'Track your submitted applications.',
    href: '/dashboard/student/applications',
    icon: ClipboardList,
  },
  {
    title: 'Post a Tuition',
    description: 'Create and manage your tuition requirements.',
    href: '/dashboard/student/tuitions',
    icon: Plus,
  },
];

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">{title}</p>

        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted">{description}</p>
    </div>
  );
}

function StudentDashboardContent() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
    plan: 'free',
  });

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [statsResponse, applicationsResponse] = await Promise.all([
        apiRequest('/api/applications/student/stats'),
        apiRequest('/api/applications/my'),
      ]);

      const statsData = statsResponse?.data ?? statsResponse;
      const applicationData = applicationsResponse?.data ?? applicationsResponse;

      setStats({
        total: statsData.total ?? 0,
        accepted: statsData.accepted ?? 0,
        pending: statsData.pending ?? 0,
        rejected: statsData.rejected ?? 0,
        plan: statsData.plan ?? 'free',
      });

      const applicationList = Array.isArray(applicationData)
        ? applicationData
        : (applicationData?.applications ?? []);

      setApplications(
        [...applicationList]
          .sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0))
          .slice(0, 5)
      );
    } catch (err) {
      setError(err.message || 'Failed to load dashboard information.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Student Workspace</p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {firstName}!
            </h1>

            <p className="mt-2 text-sm text-muted">
              Here's an overview of your tuition activities and applications.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Search size={18} />
            Find Tuitions
          </Link>
        </section>

        {/* Error Message */}
        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-medium text-red-600"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Your Overview</h2>

              <p className="mt-1 text-sm text-muted">Keep track of your activity on MentorLagbe.</p>
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-background disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Applications"
              value={loading ? '—' : stats.total}
              description="All applications you submitted"
              icon={ClipboardList}
            />

            <StatCard
              title="Accepted Applications"
              value={loading ? '—' : stats.accepted}
              description="Applications accepted by tutors"
              icon={CheckCircle2}
            />

            <StatCard
              title="Pending Applications"
              value={loading ? '—' : stats.pending}
              description="Awaiting a tutor's decision"
              icon={Clock3}
            />

            <StatCard
              title="Current Plan"
              value={loading ? '—' : stats.plan.toUpperCase()}
              description={
                stats.plan === 'pro' ? 'Enjoy your Pro membership' : 'Explore Pro membership'
              }
              icon={CreditCard}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Recent Applications */}
          <div className="space-y-5 rounded-xl border border-border bg-surface p-5 lg:col-span-2 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">Recent Applications</h2>

                <p className="mt-1 text-xs text-muted">Your latest tuition applications</p>
              </div>

              <Link
                href="/dashboard/student/applications"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="flex min-h-48 items-center justify-center text-muted">
                <LoaderCircle size={23} className="animate-spin" />
              </div>
            ) : applications.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-primary/10 p-4 text-primary">
                  <Inbox size={26} />
                </div>

                <p className="mt-3 font-medium text-foreground">No applications yet</p>

                <p className="mt-1 text-sm text-muted">
                  Start exploring available tuitions and apply to your favorites.
                </p>

                <Link
                  href="/tuitions"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Explore tuitions
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <BookOpen size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {application.tuitionTitle}
                        </p>

                        <p className="mt-1 truncate text-sm text-muted">{application.tutorEmail}</p>

                        <p className="mt-1 text-xs text-muted">
                          Applied {formatDate(application.appliedAt)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[application.status] || 'bg-background text-muted'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
            <div>
              <h2 className="font-semibold text-foreground">Quick Actions</h2>

              <p className="mt-1 text-xs text-muted">Take your next step</p>
            </div>

            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-lg border border-border p-3 transition hover:border-primary/40 hover:bg-background"
                  >
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{action.title}</p>

                      <p className="mt-1 text-xs text-muted">{action.description}</p>
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-muted transition-colors group-hover:text-primary"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pro Membership Banner */}
        {!loading && stats.plan !== 'pro' && (
          <section className="overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Crown size={20} />
                  <span className="text-sm font-semibold">MentorLagbe Pro</span>
                </div>

                <h2 className="text-xl font-bold text-foreground">
                  Get more from your learning journey
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Explore Pro membership and unlock additional opportunities on MentorLagbe.
                </p>
              </div>

              <Link
                href="/pricing"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Explore Pro
                <ArrowRight size={17} />
              </Link>
            </div>
          </section>
        )}
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
