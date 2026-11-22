'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  BookOpen,
  Clock,
  GraduationCap,
  SlidersHorizontal,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Bangla',
  'ICT',
  'General Science',
  'Computer Science',
  'Physics & Chemistry',
  'General Science & Mathematics',
];

const classLevels = ['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'University', 'Others'];

export default function TuitionsPage() {
  const [tuitions, setTuitions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [mode, setMode] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch tuition posts
  const fetchTuitions = useCallback(
    async (signal) => {
      try {
        setIsFetching(true);
        setError('');

        const params = new URLSearchParams();

        if (debouncedSearch) {
          params.set('search', debouncedSearch);
        }

        if (subject) {
          params.set('subject', subject);
        }

        if (classLevel) {
          params.set('classLevel', classLevel);
        }

        if (mode) {
          params.set('mode', mode);
        }

        const queryString = params.toString();

        const endpoint = `/api/tuitions${queryString ? `?${queryString}` : ''}`;

        const response = await apiRequest(endpoint, {
          auth: false,
          signal,
        });

        setTuitions(response.data || []);
      } catch (err) {
        if (signal?.aborted) return;

        setError(err.message || 'Failed to load tuition posts.');
      } finally {
        if (!signal?.aborted) {
          setIsFetching(false);
          setLoading(false);
        }
      }
    },
    [debouncedSearch, subject, classLevel, mode]
  );

  // Fetch whenever filters change
  useEffect(() => {
    const controller = new AbortController();

    fetchTuitions(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchTuitions, refreshKey]);

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setSubject('');
    setClassLevel('');
    setMode('');
  };

  // Refresh tuition posts
  const handleRefresh = () => {
    setRefreshKey((current) => current + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            <GraduationCap size={16} />
            Find Your Perfect Tutor
          </span>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Explore Available Tuitions
          </h1>

          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Discover learning opportunities, connect with experienced tutors, and take the next step
            in your educational journey.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="mb-5 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <SlidersHorizontal size={19} />
            Search and Filter
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title or subject..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Subject */}
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Subjects</option>

              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Class Level */}
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Class Levels</option>

              {classLevels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Mode */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Find tuition opportunities that match your needs.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Tuitions</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {loading
                ? 'Loading opportunities...'
                : isFetching
                  ? 'Updating results...'
                  : `${tuitions.length} opportunities found`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 hover:border-primary/40"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            <p>{error}</p>

            <button type="button" onClick={handleRefresh} className="mt-2 font-semibold underline">
              Try again
            </button>
          </div>
        )}

        {/* Initial Loading Skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-800" />

                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-10 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tuition Cards */}
        {!loading && !error && tuitions.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <article
                key={tuition._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Banner */}
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {tuition.bannerImage ? (
                    <img
                      src={tuition.bannerImage}
                      alt={tuition.title || 'Tuition banner'}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <BookOpen size={42} />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm dark:bg-gray-900/95 dark:text-blue-400">
                    {tuition.subject}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap gap-2 text-xs font-medium">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                      {tuition.mode}
                    </span>

                    <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {tuition.classLevel}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                    {tuition.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {tuition.description}
                  </p>

                  {/* Tuition Information */}
                  <div className="mb-5 mt-auto space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} />
                      <span>{tuition.tutorName || 'Unknown tutor'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{tuition.location || 'Online learning'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{tuition.daysPerWeek || '—'} days per week</span>
                    </div>
                  </div>

                  {/* Fee and Details */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Fee</p>

                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ৳{Number(tuition.monthlyFee || 0).toLocaleString('en-BD')}
                      </p>
                    </div>

                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tuitions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
              <Search size={30} />
            </div>

            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              No Tuitions Found
            </h3>

            <p className="mx-auto mb-6 max-w-md text-sm text-gray-500 dark:text-gray-400">
              We couldn't find any tuition opportunities matching your search. Try changing your
              filters or search terms.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
