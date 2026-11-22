'use client';

import { useEffect, useState } from 'react';
import {
  UserRound,
  LoaderCircle,
  Camera,
  Save,
  User,
  Phone,
  FileText,
  Mail,
  ShieldCheck,
  CreditCard,
  ImagePlus,
} from 'lucide-react';

import { apiRequest } from '@/lib/api';

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

  // Clean up temporary image previews.
  useEffect(() => {
    if (preview.startsWith('blob:')) {
      return () => URL.revokeObjectURL(preview);
    }
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

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10';

  const labelClass = 'mb-2 block text-sm font-medium text-foreground';

  if (loading) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-64 max-w-7xl items-center justify-center">
          <LoaderCircle size={30} className="animate-spin text-primary" />
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-500">
          {error}
        </div>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Heading */}
        <section>
          <p className="text-sm font-medium text-primary">Account Settings</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage your personal information and account details.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="font-semibold text-foreground">Profile Picture</h2>

              <p className="mt-1 text-sm text-muted">
                Choose a profile photo to personalize your account.
              </p>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                {preview ? (
                  <img src={preview} alt="Profile preview" className="size-full object-cover" />
                ) : (
                  <UserRound size={38} className="text-muted" />
                )}
              </div>

              <div className="min-w-0">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5">
                  <Camera size={17} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-xs text-muted">JPG, PNG or WEBP. Maximum file size 5 MB.</p>

                {selectedFile && (
                  <p className="mt-2 truncate text-xs font-medium text-primary">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div>
              <h2 className="font-semibold text-foreground">Personal Information</h2>

              <p className="mt-1 text-sm text-muted">
                Update your personal details and introduction.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name
                </label>

                <div className="relative">
                  <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={80}
                    className={`${inputClass} pl-11`}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={30}
                    className={`${inputClass} pl-11`}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className={labelClass}>
                Bio
              </label>

              <div className="relative">
                <FileText size={17} className="absolute left-4 top-4 text-muted" />

                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className={`${inputClass} resize-y pl-11`}
                  placeholder="Tell us a little about yourself..."
                />
              </div>

              <p className="mt-2 text-right text-xs text-muted">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </section>

          {/* Account Information */}
          <section className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <div>
              <h2 className="font-semibold text-foreground">Account Information</h2>

              <p className="mt-1 text-sm text-muted">
                Your account details and subscription information.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Mail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted">Email Address</p>
                  <p className="mt-1 break-all text-sm font-medium text-foreground">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted">Account Role</p>
                  <p className="mt-1 text-sm font-medium capitalize text-foreground">
                    {profile.role}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <CreditCard size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted">Current Plan</p>
                  <p className="mt-1 text-sm font-medium capitalize text-foreground">
                    {profile.plan || 'free'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Messages */}
          {message && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Save Button */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
