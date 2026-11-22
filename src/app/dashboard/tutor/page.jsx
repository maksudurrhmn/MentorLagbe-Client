'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import useAuth from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api';
import {
  BookOpen,
  Users,
  UserCheck,
  Crown,
  Plus,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  LoaderCircle,
  Inbox,
} from 'lucide-react';

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-600',
  accepted: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
};

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted">{description}</p>
        </div>

        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function TutorDashboardContent() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalTuitions: 0,
    activeTuitions: 0,
    totalApplicants: 0,
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
        apiRequest('/api/tuitions/tutor/stats'),
        apiRequest('/api/applications/tutor'),
      ]);

      const statsData = statsResponse?.data ?? statsResponse;
      const applicationData = applicationsResponse?.data ?? applicationsResponse;

      setStats({
        totalTuitions: statsData.totalTuitions ?? 0,
        activeTuitions: statsData.activeTuitions ?? 0,
        totalApplicants: statsData.totalApplicants ?? 0,
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
            <p className="text-sm font-medium text-primary">Tutor Workspace</p>

            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Welcome back, {user?.name?.split(' ')[0] || 'Tutor'}!
            </h1>

            <p className="mt-2 text-sm text-muted">
              Here's an overview of your tuition activities and student applications.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/tuitions/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={18} />
            Post Tuition
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
            <h2 className="text-lg font-semibold text-foreground">Your Overview</h2>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              title="Refresh dashboard"
              className="rounded-lg border border-border bg-surface p-2 text-muted transition hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Tuitions"
              value={loading ? '—' : stats.totalTuitions}
              icon={BookOpen}
              description="All your tuition posts"
            />

            <StatCard
              title="Active Tuitions"
              value={loading ? '—' : stats.activeTuitions}
              icon={CheckCircle2}
              description="Currently active posts"
            />

            <StatCard
              title="Total Applicants"
              value={loading ? '—' : stats.totalApplicants}
              icon={Users}
              description="Students who applied"
            />

            <StatCard
              title="Your Plan"
              value={loading ? '—' : stats.plan.toUpperCase()}
              icon={Crown}
              description={
                stats.plan === 'pro' ? 'Enjoy your Pro membership' : 'Upgrade for unlimited posts'
              }
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Recent Applications */}
          <div className="space-y-5 rounded-xl border border-border bg-surface p-5 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">Recent Applications</h2>
                <p className="mt-1 text-xs text-muted">
                  Latest students interested in your tuitions
                </p>
              </div>

              <Link
                href="/dashboard/tutor/applications"
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
                <p className="mt-1 text-sm text-muted">Student applications will appear here.</p>
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
                        <UserCheck size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {application.studentName}
                        </p>

                        <p className="mt-1 truncate text-sm text-muted">
                          {application.tuitionTitle}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {formatDate(application.appliedAt)}
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
              <p className="mt-1 text-xs text-muted">Manage your tutoring activities</p>
            </div>

            <div className="space-y-3">
              <Link
                href="/dashboard/tutor/tuitions/new"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:border-primary/40 hover:bg-background"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Plus size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Post Tuition</p>
                  <p className="mt-1 text-xs text-muted">Create a new tuition listing</p>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </Link>

              <Link
                href="/dashboard/tutor/tuitions"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:border-primary/40 hover:bg-background"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <BookOpen size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Manage Tuitions</p>
                  <p className="mt-1 text-xs text-muted">Edit and manage your posts</p>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </Link>

              <Link
                href="/dashboard/tutor/applications"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:border-primary/40 hover:bg-background"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Users size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">View Applications</p>
                  <p className="mt-1 text-xs text-muted">Review interested students</p>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </Link>

              <Link
                href="/pricing"
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:border-primary/40 hover:bg-background"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Crown size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Upgrade Your Plan</p>
                  <p className="mt-1 text-xs text-muted">Explore Pro membership</p>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </Link>
            </div>
          </div>
        </section>

        {/* Membership Information */}
        {!loading && stats.plan !== 'pro' && (
          <section className="overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Crown size={20} />
                  <span className="text-sm font-semibold">MentorLagbe Pro</span>
                </div>

                <h2 className="text-xl font-bold text-foreground">
                  Grow your tutoring opportunities
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Upgrade to Pro and publish unlimited tuition posts to reach more students.
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

export default function TutorDashboard() {
  return (
    <AuthGuard allowedRoles={['tutor']}>
      <TutorDashboardContent />
    </AuthGuard>
  );
}
