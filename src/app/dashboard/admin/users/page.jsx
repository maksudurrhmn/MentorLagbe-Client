'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Search,
  RefreshCw,
  UserRound,
  CalendarDays,
  Mail,
  Phone,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

const filters = ['all', 'student', 'tutor', 'admin'];

const roleStyles = {
  student: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  tutor: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  admin: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

const getUserList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.users)) return response.users;
  if (Array.isArray(response?.data?.users)) return response.data.users;
  return [];
};

const formatDate = (date) => {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{title}</p>

        <div className={`rounded-lg p-2 ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setNotice('');

      const response = await apiRequest('/api/users/admin/all');
      setUsers(getUserList(response));
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const counts = useMemo(
    () => ({
      all: users.length,
      student: users.filter((user) => user.role === 'student').length,
      tutor: users.filter((user) => user.role === 'tutor').length,
      admin: users.filter((user) => user.role === 'admin').length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesFilter = activeFilter === 'all' || user.role === activeFilter;

      const matchesSearch =
        !query ||
        [user.name, user.email, user.phone, user.role].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(query)
        );

      return matchesFilter && matchesSearch;
    });
  }, [users, activeFilter, search]);

  const handleRoleChange = async (user, nextRole) => {
    if (user.role === nextRole) return;

    const confirmed = window.confirm(
      `Change ${user.name || user.email}'s role from ${user.role} to ${nextRole}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user._id);
      setError('');
      setNotice('');

      await apiRequest(`/api/users/admin/${user._id}/role`, {
        method: 'PATCH',
        body: { role: nextRole },
      });

      setUsers((current) =>
        current.map((item) => (item._id === user._id ? { ...item, role: nextRole } : item))
      );

      setNotice(`User role updated to ${nextRole} successfully.`);
    } catch (err) {
      setError(err.message || 'Failed to update user role.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Platform Management</p>

            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">User Management</h1>

            <p className="mt-2 text-sm text-muted">
              Manage platform accounts and control user roles.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={loading ? '—' : counts.all}
            icon={Users}
            color="bg-primary/10 text-primary"
          />

          <StatCard
            title="Students"
            value={loading ? '—' : counts.student}
            icon={GraduationCap}
            color="bg-blue-500/10 text-blue-600"
          />

          <StatCard
            title="Tutors"
            value={loading ? '—' : counts.tutor}
            icon={BookOpen}
            color="bg-violet-500/10 text-violet-600"
          />

          <StatCard
            title="Admins"
            value={loading ? '—' : counts.admin}
            icon={ShieldCheck}
            color="bg-amber-500/10 text-amber-600"
          />
        </div>

        {/* Feedback */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {notice && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
            {notice}
          </div>
        )}

        {/* Search and Filters */}
        <section className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-foreground">All Platform Users</h2>

              <p className="mt-1 text-xs text-muted">{filteredUsers.length} result(s) found</p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, or phone..."
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'border border-border bg-background text-muted hover:text-foreground'
                }`}
              >
                {filter} ({counts[filter]})
              </button>
            ))}
          </div>
        </section>

        {/* User List */}
        <section className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-border bg-surface p-5 sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-background" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 rounded bg-background" />
                      <div className="h-3 w-1/2 rounded bg-background" />
                    </div>
                  </div>

                  <div className="mt-6 h-20 rounded-lg bg-background" />
                  <div className="mt-5 h-10 rounded-lg bg-background" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface px-5 py-16 text-center">
              <Users size={36} className="mx-auto text-muted" />

              <h3 className="mt-4 font-semibold text-foreground">No users found</h3>

              <p className="mt-2 text-sm text-muted">
                {search
                  ? 'Try changing your search keywords or filters.'
                  : 'There are no users in this category yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
              {filteredUsers.map((user) => (
                <article
                  key={user._id}
                  className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/30 sm:p-6"
                >
                  {/* User Information */}
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || 'User'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={23} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-foreground">
                          {user.name || 'Unnamed user'}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
                            roleStyles[user.role] || 'border-border bg-background text-muted'
                          }`}
                        >
                          {user.role || 'unknown'}
                        </span>
                      </div>

                      <p className="mt-1 break-all text-sm text-muted">{user.email}</p>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="mt-5 grid grid-cols-1 gap-3 rounded-lg bg-background p-4 sm:grid-cols-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <Mail size={15} className="mt-0.5 shrink-0 text-muted" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted">Email</p>
                        <p className="mt-1 break-all text-sm font-medium text-foreground">
                          {user.email || '—'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone size={15} className="mt-0.5 shrink-0 text-muted" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted">Phone</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {user.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CalendarDays size={15} className="mt-0.5 shrink-0 text-muted" />
                      <div>
                        <p className="text-xs text-muted">Joined</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted">Subscription</p>
                      <p className="mt-1 text-sm font-medium capitalize text-foreground">
                        {user.plan || 'free'}
                      </p>
                    </div>
                  </div>

                  {/* Role Management */}
                  <div className="mt-auto border-t border-border pt-5">
                    <label
                      htmlFor={`role-${user._id}`}
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Manage User Role
                    </label>

                    <select
                      id={`role-${user._id}`}
                      value={user.role || ''}
                      onChange={(event) => handleRoleChange(user, event.target.value)}
                      disabled={updatingId === user._id}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>

                    {updatingId === user._id && (
                      <p className="mt-2 text-xs text-muted">Updating user role...</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
