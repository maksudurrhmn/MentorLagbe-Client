'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileText,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Save,
  Wallet,
} from 'lucide-react';

export default function EditTuitionPage() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    classLevel: '',
    mode: 'Online',
    location: '',
    monthlyFee: '',
    daysPerWeek: '3',
    description: '',
  });

  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10';

  const labelClass = 'mb-2 block text-sm font-medium text-foreground';

  // Clean up temporary image preview URLs.
  useEffect(() => {
    if (!preview || !preview.startsWith('blob:')) return;

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const loadTuition = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest('/api/tuitions/my');

      const items = Array.isArray(response.data) ? response.data : response.data?.tuitions || [];

      const tuition = items.find((item) => item._id === id);

      if (!tuition) {
        throw new Error('Tuition post not found or you do not have permission to edit it.');
      }

      setFormData({
        title: tuition.title || '',
        subject: tuition.subject || '',
        classLevel: tuition.classLevel || '',
        mode: tuition.mode || 'Online',
        location: tuition.location || '',
        monthlyFee: String(tuition.monthlyFee ?? ''),
        daysPerWeek: String(tuition.daysPerWeek ?? 3),
        description: tuition.description || '',
      });

      setCurrentImage(tuition.bannerImage || '');
      setPreview(tuition.bannerImage || '');
    } catch (err) {
      setError(err.message || 'Unable to load tuition details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadTuition();
  }, [id, loadTuition]);

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
    setMessage('');
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!currentImage && !imageFile) {
      setError('Please select a banner image.');
      return;
    }

    if (formData.mode === 'Offline' && !formData.location.trim()) {
      setError('Please enter the tuition location for offline classes.');
      return;
    }

    setSaving(true);

    try {
      let bannerImage = currentImage;

      // Upload a replacement image only if one was selected.
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const uploadResponse = await apiRequest('/api/uploads/image', {
          method: 'POST',
          body: imageFormData,
        });

        bannerImage = uploadResponse.data.imageUrl;
      }

      await apiRequest(`/api/tuitions/${id}`, {
        method: 'PATCH',
        body: {
          ...formData,
          location: formData.location.trim(),
          monthlyFee: Number(formData.monthlyFee),
          daysPerWeek: Number(formData.daysPerWeek),
          bannerImage,
        },
      });

      setCurrentImage(bannerImage);
      setPreview(bannerImage);
      setImageFile(null);
      setMessage('Tuition updated successfully. It is now pending admin approval.');

      const fileInput = document.getElementById('bannerImage');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.message || 'Unable to update tuition.');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-64 items-center justify-center">
          <LoaderCircle size={30} className="animate-spin text-primary" />
        </div>
      </main>
    );
  }

  // Error state
  if (error && !formData.title) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          <Link
            href="/dashboard/tutor/tuitions"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to My Tuitions
          </Link>

          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            {error}
          </div>
        </div>
      </main>
    );
  }

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
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Edit Tuition</h1>
              <p className="mt-1 text-sm text-muted">
                Update your tuition details and submit them for review.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="space-y-6 rounded-xl border border-border bg-surface p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <BookOpen size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Basic Information</h2>
                <p className="text-xs text-muted">Update the subject and academic details.</p>
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
                  placeholder="Enter tuition title"
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
                <p className="text-xs text-muted">
                  Update the teaching mode, location, and schedule.
                </p>
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
                <p className="text-xs text-muted">Update the requirements and expectations.</p>
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
                <h2 className="font-semibold text-foreground">Tuition Banner</h2>
                <p className="text-xs text-muted">
                  Keep your current image or upload a replacement.
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

          {message && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400"
            >
              {message}
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
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
