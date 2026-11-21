'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { Plus, BookOpen, LoaderCircle, Pencil, Trash2, Power, RefreshCw } from 'lucide-react';

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

  const statusStyle = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    approved: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tuitions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your tuition posts and their approval status.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/tuitions/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Post New Tuition
        </Link>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
          {message}
        </div>
      )}

      {/* Filters and count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {status === 'all' ? 'All Posts' : status}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={loadTuitions}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tuition list */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoaderCircle size={30} className="animate-spin text-blue-600" />
        </div>
      ) : filteredTuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
          <BookOpen size={38} className="mx-auto mb-4 text-gray-400" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {filter === 'all'
              ? 'You have not posted any tuitions yet'
              : `No ${filter} tuition posts`}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create a tuition post to start connecting with students.
          </p>

          {filter === 'all' && (
            <Link
              href="/dashboard/tutor/tuitions/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Create Tuition
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredTuitions.map((tuition) => (
            <article
              key={tuition._id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              {tuition.bannerImage && (
                <img
                  src={tuition.bannerImage}
                  alt={tuition.title}
                  className="h-44 w-full object-cover"
                />
              )}

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      statusStyle[tuition.approvalStatus] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tuition.approvalStatus}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      tuition.isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {tuition.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tuition.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {tuition.subject} · {tuition.classLevel}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Fee</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      ৳{Number(tuition.monthlyFee).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Schedule</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {tuition.daysPerWeek} days/week
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {tuition.mode}
                  {tuition.location ? ` · ${tuition.location}` : ''}
                  {tuition.createdAt
                    ? ` · Posted ${new Date(tuition.createdAt).toLocaleDateString()}`
                    : ''}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(tuition)}
                    disabled={actionId === tuition._id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
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
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(tuition)}
                    disabled={actionId === tuition._id}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
