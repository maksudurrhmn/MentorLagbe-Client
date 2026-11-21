'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { UserRound, LoaderCircle } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiRequest('/api/users/profile');
        setProfile(response.data);
      } catch (err) {
        setError(err.message || 'Unable to load your profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center gap-4">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.name || 'Profile'}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound size={32} />
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted">{profile.email}</p>
            <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
              {profile.role}
            </span>
          </div>
        </div>

        <div className="my-6 border-t border-border" />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted">Phone</p>
            <p className="mt-1 text-sm">{profile.phone || 'Not provided'}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted">Membership</p>
            <p className="mt-1 text-sm capitalize">{profile.plan || 'free'}</p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-muted">Bio</p>
            <p className="mt-1 text-sm leading-6">{profile.bio || 'No bio added yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
