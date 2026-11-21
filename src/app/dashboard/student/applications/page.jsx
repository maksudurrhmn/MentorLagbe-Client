'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardList,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Trash2,
  XCircle,
} from 'lucide-react';

import { apiRequest } from '@/lib/api';

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setError('');

      const result = await apiRequest('/api/applications/my');
      setApplications(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleCancel = async (applicationId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this application?');

    if (!confirmed) return;

    try {
      setCancelingId(applicationId);

      await apiRequest(`/api/applications/${applicationId}`, {
        method: 'DELETE',
      });

      setApplications((prev) => prev.filter((application) => application._id !== applicationId));
    } catch (err) {
      setError(err.message || 'Failed to cancel application.');
    } finally {
      setCancelingId(null);
    }
  };

  const stats = [
    {
      label: 'Total Applications',
      value: applications.length,
      description: 'All applications you submitted',
      icon: ClipboardList,
    },
    {
      label: 'Pending Applications',
      value: applications.filter((item) => item.status === 'pending').length,
      description: 'Awaiting a tutor’s decision',
      icon: Clock3,
    },
    {
      label: 'Accepted Applications',
      value: applications.filter((item) => item.status === 'accepted').length,
      description: 'Applications accepted by tutors',
      icon: CheckCircle2,
    },
    {
      label: 'Rejected Applications',
      value: applications.filter((item) => item.status === 'rejected').length,
      description: 'Applications not accepted',
      icon: XCircle,
    },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Heading */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Student Workspace</p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My Applications
            </h1>

            <p className="mt-2 text-sm text-muted">
              Track and manage your submitted tuition applications.
            </p>
          </div>

          <button
            onClick={fetchApplications}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>

            <p className="mt-1 text-sm text-muted">Keep track of your application progress.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
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

        {/* Applications List */}
        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Submitted Applications</h2>

              <p className="mt-1 text-sm text-muted">
                View the details and current status of your applications.
              </p>
            </div>

            {!loading && (
              <p className="text-sm text-muted">
                {applications.length} {applications.length === 1 ? 'application' : 'applications'}
              </p>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-red-500">{error}</p>

              <button
                onClick={fetchApplications}
                className="text-left text-sm font-semibold text-primary hover:underline sm:text-right"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-surface">
              <LoaderCircle size={30} className="animate-spin text-primary" />
            </div>
          ) : applications.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <GraduationCap size={26} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-foreground">No applications yet</h3>

              <p className="mt-2 max-w-sm text-sm text-muted">
                You haven't applied for any tuition opportunities yet. Explore available tuitions
                and find the right match.
              </p>

              <Link
                href="/tuitions"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore Tuitions
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            /* Application Cards */
            <div className="grid gap-4">
              {applications.map((application) => (
                <article
                  key={application._id}
                  className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-foreground">
                        {application.tuitionTitle}
                      </h3>

                      <p className="mt-1 text-sm text-muted">{application.subject}</p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[application.status] || 'border-border bg-background text-muted'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="flex items-start gap-3">
                      <GraduationCap size={18} className="mt-0.5 shrink-0 text-muted" />

                      <div className="min-w-0">
                        <p className="text-xs text-muted">Tutor</p>
                        <p className="mt-1 break-all text-sm font-medium text-foreground">
                          {application.tutorEmail || 'Not available'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <ClipboardList size={18} className="mt-0.5 shrink-0 text-muted" />

                      <div>
                        <p className="text-xs text-muted">Monthly Fee</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          ৳{application.monthlyFee}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarDays size={18} className="mt-0.5 shrink-0 text-muted" />

                      <div>
                        <p className="text-xs text-muted">Applied On</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {application.appliedAt
                            ? new Date(application.appliedAt).toLocaleDateString()
                            : 'Not available'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {application.status === 'pending' && (
                    <div className="mt-5 flex justify-end border-t border-border pt-4">
                      <button
                        onClick={() => handleCancel(application._id)}
                        disabled={cancelingId === application._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancelingId === application._id ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}

                        {cancelingId === application._id ? 'Canceling...' : 'Cancel Application'}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
