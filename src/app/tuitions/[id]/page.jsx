'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  Send,
  UserRound,
  Wallet,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function TuitionDetailsPage() {
  const { id } = useParams();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const [formData, setFormData] = useState({
    studentPhone: '',
    preferredSchedule: '',
    studentNote: '',
  });

  useEffect(() => {
    const fetchTuition = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiRequest(`/api/tuitions/${id}`, {
          auth: false,
        });

        setTuition(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load tuition details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTuition();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNotice(null);

    if (!formData.studentPhone.trim() || !formData.preferredSchedule.trim()) {
      setNotice({
        type: 'error',
        message: 'Phone number and preferred schedule are required.',
      });
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiRequest('/api/applications', {
        method: 'POST',
        body: {
          tuitionId: id,
          ...formData,
        },
      });

      setNotice({
        type: 'success',
        message: response.message || 'Your application was submitted successfully!',
      });

      setFormData({
        studentPhone: '',
        preferredSchedule: '',
        studentNote: '',
      });
    } catch (err) {
      setNotice({
        type: 'error',
        message: err.message || 'Failed to submit your application.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </main>
    );
  }

  if (error || !tuition) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="max-w-md text-center">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={44} />
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Tuition Not Found
          </h1>
          <p className="mb-6 text-gray-500 dark:text-gray-400">
            {error || 'This tuition may have been removed or is no longer available.'}
          </p>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Browse Tuitions
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/tuitions"
          className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition hover:text-blue-600 dark:text-gray-400 hover:gap-3"
        >
          <ArrowLeft size={17} />
          Back to Tuitions
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* Tuition Information */}
          <section className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {tuition.bannerImage && (
                <div className="h-64 overflow-hidden sm:h-80">
                  <img
                    src={tuition.bannerImage}
                    alt={tuition.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {tuition.subject}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {tuition.mode}
                  </span>
                </div>

                <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  {tuition.title}
                </h1>

                <p className="leading-7 text-gray-600 dark:text-gray-400">{tuition.description}</p>

                <div className="mt-8 grid gap-5 border-t border-gray-100 pt-6 dark:border-gray-800 sm:grid-cols-2">
                  <InfoItem icon={GraduationCap} label="Class Level" value={tuition.classLevel} />
                  <InfoItem
                    icon={MapPin}
                    label="Location"
                    value={tuition.location || 'Online learning'}
                  />
                  <InfoItem
                    icon={CalendarDays}
                    label="Days Per Week"
                    value={`${tuition.daysPerWeek} days`}
                  />
                  <InfoItem
                    icon={Wallet}
                    label="Monthly Fee"
                    value={`৳${Number(tuition.monthlyFee).toLocaleString('en-BD')}`}
                  />
                </div>
              </div>
            </div>

            {/* Tutor Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-5 text-lg font-bold text-gray-900 dark:text-white">
                About the Tutor
              </h2>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <UserRound size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {tuition.tutorName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Verified tuition poster
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Application Form */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Apply for This Tuition
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Submit your information to express interest in this opportunity.
              </p>
            </div>

            {notice && (
              <div
                className={`mb-5 rounded-xl p-4 text-sm ${
                  notice.type === 'success'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}
              >
                <div className="flex items-start gap-2">
                  {notice.type === 'success' && (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  )}
                  <p>{notice.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="studentPhone"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Phone Number *
                </label>
                <input
                  id="studentPhone"
                  name="studentPhone"
                  type="number"
                  required
                  value={formData.studentPhone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="preferredSchedule"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Preferred Schedule *
                </label>
                <textarea
                  id="preferredSchedule"
                  name="preferredSchedule"
                  required
                  rows={3}
                  value={formData.preferredSchedule}
                  onChange={handleChange}
                  placeholder="Example: Saturday to Wednesday, 5 PM - 7 PM"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="studentNote"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Additional Note
                  <span className="ml-1 font-normal text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="studentNote"
                  name="studentNote"
                  rows={3}
                  value={formData.studentNote}
                  onChange={handleChange}
                  placeholder="Tell the tutor a little about yourself..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Submit Application
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Only logged-in students can apply. Duplicate applications are not allowed.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-1 font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
