'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, MapPin, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function LatestTuitions() {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatestTuitions = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiRequest('/api/tuitions', {
          auth: false,
        });

        setTuitions((response.data || []).slice(0, 3));
      } catch (err) {
        setError(err.message || 'Unable to load tuition posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTuitions();
  }, []);

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Latest Opportunities
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore Recent Tuitions
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-muted">
              Discover the latest teaching opportunities and find a tuition that matches your skills
              and preferences.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex w-fit items-center gap-2 font-semibold text-primary transition hover:gap-3"
          >
            Explore All Tuitions
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading && (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-10 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted">{error}</p>
            <p className="mt-2 text-sm text-muted">
              Please visit the tuition directory to explore available opportunities.
            </p>
          </div>
        )}

        {!loading && !error && tuitions.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <article
                key={tuition._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {tuition.bannerImage ? (
                    <img
                      src={tuition.bannerImage}
                      alt={tuition.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted">
                      <BookOpen size={40} />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary dark:bg-gray-900/95">
                    {tuition.subject}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-lg bg-blue-50 px-3 py-1 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {tuition.mode}
                    </span>
                    <span className="rounded-lg bg-gray-100 px-3 py-1 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {tuition.classLevel}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground">{tuition.title}</h3>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                    {tuition.description}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm text-muted">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={17} />
                      {tuition.tutorName}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={17} />
                      {tuition.location || 'Online learning'}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <div>
                      <p className="text-xs text-muted">Monthly Fee</p>
                      <p className="text-xl font-bold text-foreground">
                        ৳{Number(tuition.monthlyFee).toLocaleString('en-BD')}
                      </p>
                    </div>

                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && tuitions.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <BookOpen className="mx-auto mb-4 text-muted" size={36} />
            <h3 className="text-lg font-semibold text-foreground">No Tuition Posts Yet</h3>
            <p className="mt-2 text-sm text-muted">
              New teaching opportunities will appear here when available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
