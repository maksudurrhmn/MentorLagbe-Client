'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import useAuth from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api';
import {
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  LoaderCircle,
  Inbox,
  BookOpen,
  UserCog,
} from 'lucide-react';

const quickActions = [
  {
    title: 'Manage Users',
    description: 'View users and manage their roles.',
    href: '/dashboard/admin/users',
    icon: UserCog,
  },
  {
    title: 'Manage Tuitions',
    description: 'Review and moderate tuition posts.',
    href: '/dashboard/admin/tuitions',
    icon: BookOpen,
  },
  {
    title: 'View Payments',
    description: 'Review platform payment records.',
    href: '/dashboard/admin/payments',
    icon: Wallet,
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

function DistributionRow({ label, value, total, color }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-foreground">{label}</span>

        <span className="text-muted">
          {value} ({percentage}%)
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`${label} distribution`}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 overflow-hidden rounded-full bg-background"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    pendingTuitions: 0,
    approvedTuitions: 0,
    totalRevenue: 0,
  });

  const [distribution, setDistribution] = useState({
    students: 0,
    tutors: 0,
    admins: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingTuitions, setPendingTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [statsResponse, usersResponse, tuitionsResponse] = await Promise.all([
        apiRequest('/api/users/admin/stats'),
        apiRequest('/api/users/admin/all'),
        apiRequest('/api/tuitions/admin/all'),
      ]);

      const statsData = statsResponse?.data ?? statsResponse;
      const usersData = usersResponse?.data ?? usersResponse;
      const tuitionsData = tuitionsResponse?.data ?? tuitionsResponse;

      const userList = Array.isArray(usersData) ? usersData : (usersData?.users ?? []);

      const tuitionList = Array.isArray(tuitionsData)
        ? tuitionsData
        : (tuitionsData?.tuitions ?? []);

      setDistribution({
        students: userList.filter((item) => item.role === 'student').length,
        tutors: userList.filter((item) => item.role === 'tutor').length,
        admins: userList.filter((item) => item.role === 'admin').length,

        pending: tuitionList.filter((item) => item.approvalStatus === 'pending').length,

        approved: tuitionList.filter((item) => item.approvalStatus === 'approved').length,

        rejected: tuitionList.filter((item) => item.approvalStatus === 'rejected').length,
      });

      setStats({
        totalUsers: statsData.totalUsers ?? 0,
        totalTutors: statsData.totalTutors ?? 0,
        pendingTuitions: statsData.pendingTuitions ?? 0,
        approvedTuitions: statsData.approvedTuitions ?? 0,
        totalRevenue: statsData.totalRevenue ?? 0,
      });

      setRecentUsers(
        [...userList]
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 5)
      );

      setPendingTuitions(
        tuitionList
          .filter((tuition) => tuition.approvalStatus === 'pending')
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 5)
      );
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard.');
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

  const formatRevenue = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Administration Workspace</p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {firstName}!
            </h1>

            <p className="mt-2 text-sm text-muted">
              Monitor platform activity and manage MentorLagbe.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:bg-background disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            Refresh Overview
          </button>
        </section>

        {/* Error Message */}
        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="text-sm font-medium text-red-600"
            >
              Try again
            </button>
          </div>
        )}

        {/* Platform Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Platform Overview</h2>

            <p className="mt-1 text-sm text-muted">Key statistics and performance indicators.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total Users"
              value={loading ? '—' : stats.totalUsers}
              description="Registered platform members"
              icon={Users}
            />

            <StatCard
              title="Total Tutors"
              value={loading ? '—' : stats.totalTutors}
              description="Registered tutors"
              icon={GraduationCap}
            />

            <StatCard
              title="Pending Tuitions"
              value={loading ? '—' : stats.pendingTuitions}
              description="Waiting for moderation"
              icon={Clock}
            />

            <StatCard
              title="Approved Tuitions"
              value={loading ? '—' : stats.approvedTuitions}
              description="Approved tuition posts"
              icon={CheckCircle2}
            />

            <StatCard
              title="Total Revenue"
              value={loading ? '—' : formatRevenue(stats.totalRevenue)}
              description="Revenue from successful payments"
              icon={Wallet}
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <div className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">Recent Users</h2>

                <p className="mt-1 text-xs text-muted">Latest registered members</p>
              </div>

              <Link
                href="/dashboard/admin/users"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="flex min-h-40 items-center justify-center text-muted">
                <LoaderCircle size={23} className="animate-spin" />
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="flex min-h-40 flex-col items-center justify-center text-center">
                <Inbox size={27} className="text-muted" />
                <p className="mt-3 text-sm text-muted">No registered users found.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentUsers.map((member) => (
                  <div key={member._id} className="flex items-center justify-between gap-3 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {member.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {member.name}
                        </p>

                        <p className="truncate text-xs text-muted">{member.email}</p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                        {member.role}
                      </span>

                      <p className="mt-2 text-xs text-muted">{formatDate(member.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Tuitions */}
          <div className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">Pending Tuitions</h2>

                <p className="mt-1 text-xs text-muted">Posts awaiting admin approval</p>
              </div>

              <Link
                href="/dashboard/admin/tuitions"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Review all
                <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="flex min-h-40 items-center justify-center text-muted">
                <LoaderCircle size={23} className="animate-spin" />
              </div>
            ) : pendingTuitions.length === 0 ? (
              <div className="flex min-h-40 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>

                <p className="mt-3 font-medium text-foreground">All caught up!</p>

                <p className="mt-1 text-sm text-muted">There are no pending tuition posts.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pendingTuitions.map((tuition) => (
                  <div key={tuition._id} className="flex items-center justify-between gap-3 py-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <BookOpen size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {tuition.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-muted">
                          {tuition.tutorName || tuition.tutorEmail}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          Submitted {formatDate(tuition.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Analytics */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Platform Analytics</h2>

            <p className="mt-1 text-sm text-muted">
              Visual insights into your platform's users and tuition activity.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* User Distribution */}
            <div className="space-y-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">User Distribution</h3>
                  <p className="mt-1 text-xs text-muted">Breakdown by account role</p>
                </div>

                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Users size={20} />
                </div>
              </div>

              <div className="text-3xl font-bold text-foreground">
                {loading ? '—' : distribution.students + distribution.tutors + distribution.admins}
                <span className="ml-2 text-sm font-normal text-muted">Total accounts</span>
              </div>

              <div className="space-y-5">
                <DistributionRow
                  label="Students"
                  value={distribution.students}
                  total={distribution.students + distribution.tutors + distribution.admins}
                  color="bg-primary"
                />

                <DistributionRow
                  label="Tutors"
                  value={distribution.tutors}
                  total={distribution.students + distribution.tutors + distribution.admins}
                  color="bg-sky-500"
                />

                <DistributionRow
                  label="Admins"
                  value={distribution.admins}
                  total={distribution.students + distribution.tutors + distribution.admins}
                  color="bg-violet-500"
                />
              </div>
            </div>

            {/* Tuition Status */}
            <div className="space-y-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Tuition Status</h3>
                  <p className="mt-1 text-xs text-muted">Moderation status breakdown</p>
                </div>

                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <BookOpen size={20} />
                </div>
              </div>

              <div className="text-3xl font-bold text-foreground">
                {loading
                  ? '—'
                  : distribution.pending + distribution.approved + distribution.rejected}
                <span className="ml-2 text-sm font-normal text-muted">Total posts</span>
              </div>

              <div className="space-y-5">
                <DistributionRow
                  label="Approved"
                  value={distribution.approved}
                  total={distribution.pending + distribution.approved + distribution.rejected}
                  color="bg-emerald-500"
                />

                <DistributionRow
                  label="Pending"
                  value={distribution.pending}
                  total={distribution.pending + distribution.approved + distribution.rejected}
                  color="bg-amber-500"
                />

                <DistributionRow
                  label="Rejected"
                  value={distribution.rejected}
                  total={distribution.pending + distribution.approved + distribution.rejected}
                  color="bg-red-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>

            <p className="mt-1 text-sm text-muted">Access important platform management tools.</p>
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
