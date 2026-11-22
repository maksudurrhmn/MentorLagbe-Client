'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

const filters = ['all', 'pending', 'approved', 'rejected'];

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const getTuitionList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.tuitions)) return response.tuitions;
  if (Array.isArray(response?.data?.tuitions)) {
    return response.data.tuitions;
  }
  return [];
};

const formatDate = (date) => {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{title}</p>
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function AdminTuitionsPage() {
  const [tuitions, setTuitions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchTuitions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiRequest('/api/tuitions/admin/all');
      setTuitions(getTuitionList(response));
    } catch (err) {
      setError(err.message || 'Failed to load tuition posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTuitions();
  }, [fetchTuitions]);

  const counts = useMemo(
    () => ({
      all: tuitions.length,
      pending: tuitions.filter((item) => item.approvalStatus === 'pending').length,
      approved: tuitions.filter((item) => item.approvalStatus === 'approved').length,
      rejected: tuitions.filter((item) => item.approvalStatus === 'rejected').length,
    }),
    [tuitions]
  );

  const filteredTuitions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tuitions.filter((tuition) => {
      const matchesFilter = activeFilter === 'all' || tuition.approvalStatus === activeFilter;

      const matchesSearch =
        !query ||
        [
          tuition.title,
          tuition.subject,
          tuition.classLevel,
          tuition.tutorName,
          tuition.tutorEmail,
        ].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(query)
        );

      return matchesFilter && matchesSearch;
    });
  }, [tuitions, activeFilter, search]);

  const handleApproval = async (tuition, nextStatus) => {
    const action = nextStatus === 'approved' ? 'approve' : 'reject';

    const confirmed = window.confirm(`Are you sure you want to ${action} "${tuition.title}"?`);

    if (!confirmed) return;

    try {
      setUpdatingId(tuition._id);
      setError('');
      setNotice('');

      await apiRequest(`/api/tuitions/${tuition._id}/approval`, {
        method: 'PATCH',
        body: { approvalStatus: nextStatus },
      });

      setTuitions((current) =>
        current.map((item) =>
          item._id === tuition._id ? { ...item, approvalStatus: nextStatus } : item
        )
      );

      setNotice(`Tuition post ${nextStatus} successfully.`);
    } catch (err) {
      setError(err.message || 'Failed to update tuition status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Platform Management</p>

            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
              Tuition Management
            </h1>

            <p className="mt-2 text-sm text-muted">
              Review, approve, and manage tuition posts submitted by tutors.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTuitions}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Tuitions"
            value={counts.all}
            icon={BookOpen}
            color="bg-primary/10 text-primary"
          />

          <StatCard
            title="Pending Review"
            value={counts.pending}
            icon={Clock3}
            color="bg-amber-500/10 text-amber-600"
          />

          <StatCard
            title="Approved"
            value={counts.approved}
            icon={CheckCircle2}
            color="bg-emerald-500/10 text-emerald-600"
          />

          <StatCard
            title="Rejected"
            value={counts.rejected}
            icon={XCircle}
            color="bg-red-500/10 text-red-600"
          />
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {notice && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
            {notice}
          </div>
        )}

        {/* Filters and Search */}
        <section className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-foreground">All Tuition Posts</h2>
              <p className="mt-1 text-xs text-muted">{filteredTuitions.length} result(s) found</p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, subject, or tutor..."
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'border border-border bg-background text-muted hover:text-foreground'
                }`}
              >
                {filter} ({counts[filter]})
              </button>
            ))}
          </div>
        </section>

        {/* Tuition List */}

        <section className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <div className="h-44 bg-background" />
                  <div className="space-y-5 p-5 sm:p-6">
                    <div className="h-5 w-2/3 rounded bg-background" />
                    <div className="h-4 w-1/2 rounded bg-background" />
                    <div className="h-24 rounded-lg bg-background" />
                    <div className="h-16 rounded-lg bg-background" />
                    <div className="h-10 rounded-lg bg-background" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTuitions.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface px-5 py-16 text-center">
              <BookOpen size={36} className="mx-auto text-muted" />

              <h3 className="mt-4 font-semibold text-foreground">No tuition posts found</h3>

              <p className="mt-2 text-sm text-muted">
                {search
                  ? 'Try changing your search keywords or filters.'
                  : 'There are no tuition posts in this category yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
              {filteredTuitions.map((tuition) => (
                <article
                  key={tuition._id}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary/30"
                >
                  {/* Banner */}
                  <div className="h-44 shrink-0 overflow-hidden bg-background">
                    {tuition.bannerImage ? (
                      <img
                        src={tuition.bannerImage}
                        alt={tuition.title || 'Tuition banner'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen size={36} className="text-muted/40" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
                    {/* Title and Status */}
                    <div className="flex min-h-16 items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-base font-semibold leading-6 text-foreground sm:text-lg">
                          {tuition.title}
                        </h3>

                        <p className="mt-1 text-sm text-muted">
                          {tuition.subject} · {tuition.classLevel}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                          statusStyles[tuition.approvalStatus] ||
                          'border-border bg-background text-muted'
                        }`}
                      >
                        {tuition.approvalStatus || 'unknown'}
                      </span>
                    </div>

                    {/* Tuition Details */}
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-background p-4">
                      <div>
                        <p className="text-xs text-muted">Monthly Fee</p>
                        <p className="mt-1 font-semibold text-foreground">
                          ৳{Number(tuition.monthlyFee || 0).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">Days per Week</p>
                        <p className="mt-1 font-semibold text-foreground">
                          {tuition.daysPerWeek || '—'} days
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">Mode</p>
                        <p className="mt-1 font-semibold text-foreground">{tuition.mode || '—'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">Availability</p>
                        <p className="mt-1 font-semibold text-foreground">
                          {tuition.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>

                    {/* Tutor Information */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Tutor Information
                      </p>

                      <div className="flex min-h-12 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Users size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {tuition.tutorName || 'Unknown tutor'}
                          </p>

                          <p className="truncate text-xs text-muted">
                            {tuition.tutorEmail || 'No email available'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location and Date */}
                    <div className="flex min-h-8 flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                      {tuition.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} className="shrink-0" />
                          {tuition.location}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="shrink-0" />
                        Posted {formatDate(tuition.createdAt)}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="min-h-18">
                      {tuition.description && (
                        <p className="line-clamp-3 text-sm leading-6 text-muted">
                          {tuition.description}
                        </p>
                      )}
                    </div>

                    {/* Moderation Actions */}
                    <div className="mt-auto border-t border-border pt-4">
                      {tuition.approvalStatus === 'pending' ? (
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => handleApproval(tuition, 'approved')}
                            disabled={updatingId === tuition._id}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <CheckCircle2 size={16} />
                            {updatingId === tuition._id ? 'Updating...' : 'Approve'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApproval(tuition, 'rejected')}
                            disabled={updatingId === tuition._id}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <p className="py-2 text-center text-xs text-muted">
                          This tuition post has already been reviewed.
                        </p>
                      )}
                    </div>
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
