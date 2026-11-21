'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  CalendarDays,
  Mail,
  Phone,
  BookOpen,
  LoaderCircle,
  Inbox,
} from 'lucide-react';

const filters = ['all', 'pending', 'accepted', 'rejected'];

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-600',
  accepted: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-red-500/10 text-red-600',
};

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function TutorApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiRequest('/api/applications/tutor');
      const data = response?.data ?? response;

      setApplications(
        Array.isArray(data) ? data : Array.isArray(data?.applications) ? data.applications : []
      );
    } catch (err) {
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((app) => app.status === 'pending').length,
      accepted: applications.filter((app) => app.status === 'accepted').length,
      rejected: applications.filter((app) => app.status === 'rejected').length,
    }),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    if (activeFilter === 'all') return applications;
    return applications.filter((app) => app.status === activeFilter);
  }, [applications, activeFilter]);

  const updateStatus = async (applicationId, status) => {
    const action = status === 'accepted' ? 'accept' : 'reject';

    if (!window.confirm(`Are you sure you want to ${action} this application?`)) {
      return;
    }

    try {
      setProcessingId(applicationId);
      setError('');
      setNotice('');

      await apiRequest(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        body: { status },
      });

      setApplications((current) =>
        current.map((app) => (app._id === applicationId ? { ...app, status } : app))
      );

      setNotice(`Application ${action}ed successfully.`);
    } catch (err) {
      setError(err.message || `Failed to ${action} application.`);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Users size={20} />
              <span className="text-sm font-semibold">Student Management</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Student Applications</h1>
            <p className="mt-2 text-sm text-muted">
              Review applications and manage students interested in your tuitions.
            </p>
          </div>

          <button
            onClick={fetchApplications}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-background disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={Users}
            color="bg-primary/10 text-primary"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            color="bg-amber-500/10 text-amber-600"
          />
          <StatCard
            title="Accepted"
            value={stats.accepted}
            icon={CheckCircle2}
            color="bg-emerald-500/10 text-emerald-600"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            color="bg-red-500/10 text-red-600"
          />
        </div>

        {/* Notifications */}
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

        {/* Application List */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-foreground">All Applications</h2>
              <p className="mt-1 text-sm text-muted">
                {filteredApplications.length} application(s) found
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium capitalize transition ${
                    activeFilter === filter
                      ? 'bg-primary text-white'
                      : 'border border-border bg-surface text-muted hover:text-foreground'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-surface">
              <div className="flex items-center gap-3 text-muted">
                <LoaderCircle size={22} className="animate-spin" />
                <span className="text-sm">Loading applications...</span>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 text-center">
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                <Inbox size={28} />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">No applications found</h3>
              <p className="mt-2 max-w-sm text-sm text-muted">
                {activeFilter === 'all'
                  ? 'You have not received any student applications yet.'
                  : `There are no ${activeFilter} applications right now.`}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredApplications.map((application) => (
                <article
                  key={application._id}
                  className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary/30"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="wrap-break-words font-semibold text-foreground">
                        {application.studentName}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        Applied {formatDate(application.appliedAt)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[application.status] || 'bg-background text-muted'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>

                  {/* Tuition */}
                  <div className="mt-5 rounded-lg bg-background p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <BookOpen size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="wrap-break-words font-medium text-foreground">
                          {application.tuitionTitle}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {application.subject || 'Subject not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-sm text-muted">Monthly fee</span>
                      <span className="font-semibold text-foreground">
                        ৳{Number(application.monthlyFee || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Student Information */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <Mail size={16} className="shrink-0 text-primary" />
                      <span className="break-all">{application.studentEmail}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted">
                      <Phone size={16} className="shrink-0 text-primary" />
                      <span>{application.studentPhone || 'Not provided'}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted">
                      <CalendarDays size={16} className="shrink-0 text-primary" />
                      <span>{application.preferredSchedule || 'No preferred schedule'}</span>
                    </div>
                  </div>

                  {application.studentNote && (
                    <div className="mt-5 rounded-lg border border-border p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                        Student Note
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {application.studentNote}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {application.status === 'pending' && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                      <button
                        onClick={() => updateStatus(application._id, 'accepted')}
                        disabled={processingId === application._id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {processingId === application._id ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                        Accept
                      </button>

                      <button
                        onClick={() => updateStatus(application._id, 'rejected')}
                        disabled={processingId === application._id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Reject
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
