'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  BookOpen,
  LoaderCircle,
  Pencil,
  Trash2,
  Power,
  RefreshCw,
  CalendarDays,
  MapPin,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';

import { apiRequest } from '@/lib/api';

const filters = ['all', 'pending', 'approved', 'rejected'];

const statusStyles = {
  pending: 'border-amber-500/20 bg-amber-500/10 text-amber-600',
  approved: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
  rejected: 'border-red-500/20 bg-red-500/10 text-red-500',
};

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [actionId, setActionId] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadTuitions = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest('/api/tuitions/my');

      const items = Array.isArray(response.data) ? response.data : response.data?.tuitions || [];

      setTuitions(items);
    } catch (err) {
      setError(err.message || 'Unable to load your tuition posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTuitions();
  }, [loadTuitions]);

  const handleToggleStatus = async (tuition) => {
    setActionId(tuition._id);
    setError('');
    setMessage('');

    try {
      await apiRequest(`/api/tuitions/${tuition._id}/status`, {
        method: 'PATCH',
        body: { isActive: !tuition.isActive },
      });

      setMessage(`Tuition post ${tuition.isActive ? 'deactivated' : 'activated'} successfully.`);

      await loadTuitions();
    } catch (err) {
      setError(err.message || 'Unable to update tuition status.');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (tuition) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${tuition.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setActionId(tuition._id);
    setError('');
    setMessage('');

    try {
      await apiRequest(`/api/tuitions/${tuition._id}`, {
        method: 'DELETE',
      });

      setMessage('Tuition post deleted successfully.');
      await loadTuitions();
    } catch (err) {
      setError(err.message || 'Unable to delete this tuition post.');
    } finally {
      setActionId(null);
    }
  };

  const filteredTuitions =
    filter === 'all' ? tuitions : tuitions.filter((tuition) => tuition.approvalStatus === filter);

  const activeCount = tuitions.filter((item) => item.isActive).length;
  const pendingCount = tuitions.filter((item) => item.approvalStatus === 'pending').length;

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Heading */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Tutor Workspace</p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My Tuitions
            </h1>

            <p className="mt-2 text-sm text-muted">
              Manage your tuition posts and monitor their approval status.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/tuitions/new"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:self-auto"
          >
            <Plus size={18} />
            Post Tuition
          </Link>
        </section>

        {/* Overview */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>

            <p className="mt-1 text-sm text-muted">A quick look at your tuition posts.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: 'Total Posts',
                value: tuitions.length,
                description: 'All your tuition posts',
                icon: BookOpen,
              },
              {
                label: 'Active Posts',
                value: activeCount,
                description: 'Currently active posts',
                icon: Power,
              },
              {
                label: 'Pending Approval',
                value: pendingCount,
                description: 'Waiting for admin review',
                icon: CalendarDays,
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-muted">{stat.label}</p>

                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon size={20} />
                    </div>
                  </div>

                  <p className="mt-4 text-3xl font-bold text-foreground">
                    {loading ? '—' : stat.value}
                  </p>

                  <p className="mt-1 text-xs text-muted">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feedback */}
        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-500">{error}</p>

            <button
              type="button"
              onClick={loadTuitions}
              className="text-left text-sm font-semibold text-primary hover:underline sm:text-right"
            >
              Try again
            </button>
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600">
            {message}
          </div>
        )}

        {/* Tuition Posts */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Tuition Posts</h2>

            <p className="mt-1 text-sm text-muted">
              Review, update, and manage your published tuition opportunities.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    filter === status
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-surface text-muted hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {status === 'all' ? 'All Posts' : status}
                  {status === 'all' && <span className="ml-2 opacity-75">{tuitions.length}</span>}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={loadTuitions}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-surface">
              <LoaderCircle size={30} className="animate-spin text-primary" />
            </div>
          ) : filteredTuitions.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                <BookOpen size={28} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {filter === 'all'
                  ? 'You have not posted any tuitions yet'
                  : `No ${filter} tuition posts`}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-muted">
                {filter === 'all'
                  ? 'Create your first tuition post to start connecting with students.'
                  : `You currently have no ${filter} tuition posts.`}
              </p>

              {filter === 'all' && (
                <Link
                  href="/dashboard/tutor/tuitions/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Plus size={17} />
                  Create Tuition
                </Link>
              )}
            </div>
          ) : (
            /* Tuition Cards */
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredTuitions.map((tuition) => (
                <article
                  key={tuition._id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                >
                  {/* Banner */}
                  {tuition.bannerImage ? (
                    <div className="h-44 overflow-hidden bg-background">
                      <img
                        src={tuition.bannerImage}
                        alt={tuition.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-primary/5">
                      <BookOpen size={36} className="text-primary/50" />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[tuition.approvalStatus] ||
                          'border-border bg-background text-muted'
                        }`}
                      >
                        {tuition.approvalStatus}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          tuition.isActive
                            ? 'border-primary/20 bg-primary/10 text-primary'
                            : 'border-border bg-background text-muted'
                        }`}
                      >
                        {tuition.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="mt-4">
                      <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
                        {tuition.title}
                      </h3>

                      <p className="mt-1 text-sm text-muted">
                        {tuition.subject} · {tuition.classLevel}
                      </p>
                    </div>

                    {/* Tuition Details */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-background p-3">
                        <div className="flex items-center gap-2 text-muted">
                          <Wallet size={15} />
                          <p className="text-xs">Monthly Fee</p>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-foreground">
                          ৳{Number(tuition.monthlyFee).toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-xl bg-background p-3">
                        <div className="flex items-center gap-2 text-muted">
                          <CalendarDays size={15} />
                          <p className="text-xs">Schedule</p>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {tuition.daysPerWeek} days/week
                        </p>
                      </div>
                    </div>

                    {/* Location and Date */}
                    <div className="mt-4 flex flex-col gap-2 text-xs text-muted">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="shrink-0" />
                        <span>
                          {tuition.mode}
                          {tuition.location ? ` · ${tuition.location}` : ''}
                        </span>
                      </div>

                      {tuition.createdAt && (
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} className="shrink-0" />
                          <span>Posted on {new Date(tuition.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(tuition)}
                        disabled={actionId === tuition._id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionId === tuition._id ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : (
                          <Power size={15} />
                        )}

                        {tuition.isActive ? 'Deactivate' : 'Activate'}
                      </button>

                      <Link
                        href={`/dashboard/tutor/tuitions/${tuition._id}/edit`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(tuition)}
                        disabled={actionId === tuition._id}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>

                    <Link
                      href={`/dashboard/tutor/tuitions/${tuition._id}/edit`}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Manage tuition details
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
