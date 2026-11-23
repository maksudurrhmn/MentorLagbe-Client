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
import toast from 'react-hot-toast';

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const formatDate = (date) => {
  if (!date) return 'Not available';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return 'Not available';

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);

  // Fetch applications and support manual refresh.
  const fetchApplications = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      setRefreshing(true);

      const result = await apiRequest('/api/applications/my', {
        cache: 'no-store',
      });

      const payload = result?.data ?? result;
      const applicationList = Array.isArray(payload) ? payload : payload?.applications;

      if (!Array.isArray(applicationList)) {
        throw new Error('Invalid applications response.');
      }

      setApplications(applicationList);
    } catch (err) {
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Cancel a pending application.
  const handleCancel = async (applicationId) => {
    try {
      setCancelingId(applicationId);
      setError('');

      await apiRequest(`/api/applications/${applicationId}`, {
        method: 'DELETE',
      });

      setApplications((prev) => prev.filter((application) => application._id !== applicationId));
      toast.success('Application cancelled successfully.');
    } catch (err) {
      setError(err.message || 'Failed to cancel application.');
      toast.error(err.message || 'Failed to cancel application.');
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
            type="button"
            onClick={fetchApplications}
            disabled={loading || refreshing}
            title="Refresh applications"
            aria-label="Refresh applications"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-red-500">{error}</p>

              <button
                type="button"
                onClick={fetchApplications}
                disabled={loading || refreshing}
                className="shrink-0 text-left text-sm font-semibold text-primary hover:underline disabled:opacity-50 sm:text-right"
              >
                Try again
              </button>
            </div>
          )}

          {/* Initial Loading */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-surface">
              <LoaderCircle size={30} className="animate-spin text-primary" />
            </div>
          ) : applications.length === 0 && error ? (
            /* Failed Initial Loading */
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-surface px-4 py-10 text-center">
              <XCircle size={30} className="text-red-500" />

              <h3 className="mt-4 font-semibold text-foreground">Couldn't load applications</h3>

              <p className="mt-2 text-sm text-muted">Please check your connection and try again.</p>

              <button
                type="button"
                onClick={fetchApplications}
                disabled={refreshing}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                Try again
              </button>
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
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Explore Tuitions
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            /* Application Cards */
            <div className="grid gap-4">
              {applications.map((application) => {
                const isCanceling = cancelingId === application._id;

                return (
                  <article
                    key={application._id}
                    className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-foreground">
                          {application.tuitionTitle || 'Untitled Tuition'}
                        </h3>

                        <p className="mt-1 text-sm text-muted">
                          {application.subject || 'Subject not specified'}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[application.status] ||
                          'border-border bg-background text-muted'
                        }`}
                      >
                        {application.status || 'Unknown'}
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
                            {application.monthlyFee != null
                              ? `৳${application.monthlyFee}`
                              : 'Not available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarDays size={18} className="mt-0.5 shrink-0 text-muted" />

                        <div>
                          <p className="text-xs text-muted">Applied On</p>

                          <p className="mt-1 text-sm font-medium text-foreground">
                            {formatDate(application.appliedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cancel Application */}
                    {application.status === 'pending' && (
                      <div className="mt-5 flex justify-end border-t border-border pt-4">
                        <button
                          type="button"
                          onClick={() => handleCancel(application._id)}
                          disabled={cancelingId !== null}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                          {isCanceling ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}

                          {isCanceling ? 'Canceling...' : 'Cancel Application'}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
