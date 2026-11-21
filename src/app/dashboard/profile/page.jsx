'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { UserRound, LoaderCircle, Camera, Save } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    image: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiRequest('/api/users/profile');
        const user = response.data;

        setProfile(user);
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          bio: user.bio || '',
          image: user.image || '',
        });
        setPreview(user.image || '');
      } catch (err) {
        setError(err.message || 'Unable to load your profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    try {
      let imageUrl = formData.image;

      // Upload the selected image to ImgBB first.
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile);

        const uploadResponse = await apiRequest('/api/uploads/image', {
          method: 'POST',
          body: imageFormData,
        });

        imageUrl = uploadResponse.data.imageUrl;
      }

      // Save the updated profile.
      const response = await apiRequest('/api/users/profile', {
        method: 'PATCH',
        body: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          bio: formData.bio.trim(),
          image: imageUrl,
        },
      });

      const updatedProfile = response.data;

      setProfile((prev) => ({
        ...prev,
        ...updatedProfile,
      }));

      setFormData({
        name: updatedProfile.name || '',
        phone: updatedProfile.phone || '',
        bio: updatedProfile.bio || '',
        image: updatedProfile.image || '',
      });

      setPreview(updatedProfile.image || '');
      setSelectedFile(null);
      setMessage('Your profile has been updated successfully.');
    } catch (err) {
      setError(err.message || 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="animate-spin text-blue-600" size={30} />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your personal information and profile picture.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile picture */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-5 font-semibold text-gray-900 dark:text-white">Profile Picture</h2>

          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              {preview ? (
                <img src={preview} alt="Profile preview" className="size-full object-cover" />
              ) : (
                <UserRound size={40} className="text-gray-400" />
              )}
            </div>

            <div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                <Camera size={17} />
                Choose Image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG or WEBP. Maximum size 5 MB.
              </p>
            </div>
          </div>
        </section>

        {/* Personal information */}
        <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-semibold text-gray-900 dark:text-white">Personal Information</h2>

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={80}
              className={inputClass}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              maxLength={30}
              className={inputClass}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              className={inputClass}
              placeholder="Tell us a little about yourself..."
            />
            <p className="mt-1 text-right text-xs text-gray-400">{formData.bio.length}/500</p>
          </div>
        </section>

        {/* Account information */}
        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-semibold text-gray-900 dark:text-white">Account Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Email Address</p>
              <p className="break-all text-sm font-medium text-gray-900 dark:text-white">
                {profile.email}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Account Role</p>
              <p className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                {profile.role}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Current Plan</p>
              <p className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                {profile.plan || 'free'}
              </p>
            </div>
          </div>
        </section>

        {message && (
          <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
            {message}
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
  );
}
