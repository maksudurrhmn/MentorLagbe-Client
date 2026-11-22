'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Upload,
  BookOpen,
  MapPin,
  Wallet,
  CalendarDays,
  FileText,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

const initialForm = {
  title: '',
  subject: '',
  classLevel: '',
  mode: 'Online',
  location: '',
  monthlyFee: '',
  daysPerWeek: '3',
  description: '',
};

export default function CreateTuitionPage() {
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10';

  const labelClass = 'mb-2 block text-sm font-medium text-foreground';

  // Clean up temporary image preview URLs.
  useEffect(() => {
    if (!preview || !preview.startsWith('blob:')) return;

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.');
      e.target.value = '';
      return;
    }

    setError('');
    setSuccess('');
    setImageFile(file);

    setPreview((previousPreview) => {
      if (previousPreview.startsWith('blob:')) {
        URL.revokeObjectURL(previousPreview);
      }

      return URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!imageFile) {
      setError('Please select a banner image.');
      return;
    }

    if (formData.mode === 'Offline' && !formData.location.trim()) {
      setError('Please enter the tuition location for offline classes.');
      return;
    }

    setSubmitting(true);

    try {
      // Upload the banner image to ImgBB.
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);

      const uploadResponse = await apiRequest('/api/uploads/image', {
        method: 'POST',
        body: imageFormData,
      });

      const bannerImage = uploadResponse.data.imageUrl;

      // Create the tuition using the uploaded image URL.
      await apiRequest('/api/tuitions', {
        method: 'POST',
        body: {
          ...formData,
          location: formData.location.trim(),
          monthlyFee: Number(formData.monthlyFee),
          daysPerWeek: Number(formData.daysPerWeek),
          bannerImage,
        },
      });

      setSuccess(
        'Your tuition post has been submitted successfully. It is now pending admin approval.'
      );

      setFormData(initialForm);
      setImageFile(null);
      setPreview('');

      const fileInput = document.getElementById('bannerImage');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.message || 'Unable to create your tuition post.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div>
          <Link
            href="/dashboard/tutor/tuitions"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to My Tuitions
          </Link>

          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <BookOpen size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Create Tuition</h1>
              <p className="mt-1 text-sm text-muted">
                Share your tuition opportunity and connect with students.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="space-y-6 rounded-xl border border-border bg-surface p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <BookOpen size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Basic Information</h2>
                <p className="text-xs text-muted">Provide the subject and academic details.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Tuition Title *
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  className={inputClass}
                  placeholder="e.g. Experienced Math Tutor Needed for Class 9"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={60}
                    className={inputClass}
                    placeholder="e.g. Mathematics"
                  />
                </div>

                <div>
                  <label htmlFor="classLevel" className={labelClass}>
                    Class Level *
                  </label>
                  <input
                    id="classLevel"
                    name="classLevel"
                    value={formData.classLevel}
                    onChange={handleChange}
                    required
                    maxLength={60}
                    className={inputClass}
                    placeholder="e.g. Class 9"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Tuition Details */}
          <section className="space-y-6 rounded-xl border border-border bg-surface p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <MapPin size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Tuition Details</h2>
                <p className="text-xs text-muted">Set the teaching mode, location, and schedule.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="mode" className={labelClass}>
                  Tuition Mode *
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  Location {formData.mode === 'Offline' ? '*' : '(Optional)'}
                </label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required={formData.mode === 'Offline'}
                  maxLength={120}
                  className={inputClass}
                  placeholder="e.g. Dhanmondi, Dhaka"
                />
              </div>

              <div>
                <label htmlFor="monthlyFee" className={labelClass}>
                  Monthly Fee (৳) *
                </label>
                <div className="relative">
                  <Wallet
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="monthlyFee"
                    name="monthlyFee"
                    type="number"
                    min="1"
                    value={formData.monthlyFee}
                    onChange={handleChange}
                    required
                    className={`${inputClass} pl-11`}
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="daysPerWeek" className={labelClass}>
                  Days Per Week *
                </label>
                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <select
                    id="daysPerWeek"
                    name="daysPerWeek"
                    value={formData.daysPerWeek}
                    onChange={handleChange}
                    required
                    className={`${inputClass} pl-11`}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <option key={day} value={day}>
                        {day} {day === 1 ? 'Day' : 'Days'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <FileText size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Description</h2>
                <p className="text-xs text-muted">Explain the requirements and expectations.</p>
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Tuition Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                maxLength={2000}
                className={`${inputClass} resize-y`}
                placeholder="Describe the tuition requirements, schedule, and expectations..."
              />
              <p className="mt-2 text-right text-xs text-muted">
                {formData.description.length}/2000 characters
              </p>
            </div>
          </section>

          {/* Banner Image */}
          <section className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <ImagePlus size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Tuition Banner *</h2>
                <p className="text-xs text-muted">
                  Upload an image to represent your tuition post.
                </p>
              </div>
            </div>

            <label
              htmlFor="bannerImage"
              className="flex min-h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-background transition hover:border-primary/50"
            >
              {preview ? (
                <div className="w-full">
                  <img
                    src={preview}
                    alt="Tuition banner preview"
                    className="max-h-80 w-full object-cover"
                  />
                  <p className="border-t border-border px-4 py-3 text-center text-xs font-medium text-primary">
                    Click to change banner image
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center p-8 text-center">
                  <div className="mb-3 rounded-xl bg-primary/10 p-4 text-primary">
                    <Upload size={25} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload a banner image
                  </p>
                  <p className="mt-2 text-xs text-muted">JPG, PNG or WEBP · Maximum 5 MB</p>
                </div>
              )}

              <input
                id="bannerImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </section>

          {/* Feedback */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
            >
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/tutor/tuitions"
              className="rounded-xl border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-background"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload size={17} />
                  Submit Tuition
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
