'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, ImagePlus, LoaderCircle, Upload } from 'lucide-react';

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
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white';

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
    setPreview(URL.createObjectURL(file));
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/dashboard/tutor"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-blue-600 dark:text-gray-400"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post a Tuition</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Share the details of your tuition opportunity with students.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
      >
        {/* Basic information */}
        <section className="space-y-5">
          <h2 className="font-semibold text-gray-900 dark:text-white">Basic Information</h2>

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
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
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="classLevel"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
        </section>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Tuition details */}
        <section className="space-y-5">
          <h2 className="font-semibold text-gray-900 dark:text-white">Tuition Details</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="mode"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="monthlyFee"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Monthly Fee (৳) *
              </label>
              <input
                id="monthlyFee"
                name="monthlyFee"
                type="number"
                min="1"
                value={formData.monthlyFee}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="e.g. 5000"
              />
            </div>

            <div>
              <label
                htmlFor="daysPerWeek"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Days Per Week *
              </label>
              <select
                id="daysPerWeek"
                name="daysPerWeek"
                value={formData.daysPerWeek}
                onChange={handleChange}
                required
                className={inputClass}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <option key={day} value={day}>
                    {day} {day === 1 ? 'Day' : 'Days'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              maxLength={2000}
              className={inputClass}
              placeholder="Describe the tuition requirements, schedule, and expectations..."
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {formData.description.length}/2000
            </p>
          </div>
        </section>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Banner image */}
        <section className="space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Tuition Banner *</h2>

          <label
            htmlFor="bannerImage"
            className="flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800/50"
          >
            {preview ? (
              <img
                src={preview}
                alt="Tuition banner preview"
                className="max-h-64 w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center p-6 text-center">
                <ImagePlus size={32} className="mb-3 text-gray-400" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Click to upload a banner image
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  JPG, PNG or WEBP · Maximum 5 MB
                </p>
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

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
            {success}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/tutor"
            className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
  );
}
