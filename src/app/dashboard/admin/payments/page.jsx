'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Receipt,
  Users,
  Search,
  RefreshCw,
  CalendarDays,
  ArrowUpRight,
  CheckCircle2,
  LoaderCircle,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

const formatCurrency = (amount, currency = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount || 0);
};

const formatDate = (date) => {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return 'N/A';

  return parsedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const roleStyles = {
  student: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  tutor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiRequest('/api/payments/admin/all');

      setPayments(response?.data?.payments || []);
    } catch (err) {
      setError(err.message || 'Unable to load payment history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        (payment.userName || '').toLowerCase().includes(searchTerm) ||
        (payment.userEmail || '').toLowerCase().includes(searchTerm) ||
        (payment.transactionId || '').toLowerCase().includes(searchTerm) ||
        (payment.planName || '').toLowerCase().includes(searchTerm);

      const matchesRole = roleFilter === 'all' || payment.userRole === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [payments, search, roleFilter]);

  const totalRevenue = useMemo(
    () => payments.reduce((total, payment) => total + (Number(payment.amount) || 0), 0),
    [payments]
  );

  const studentPayments = payments.filter((payment) => payment.userRole === 'student').length;

  const tutorPayments = payments.filter((payment) => payment.userRole === 'tutor').length;

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      description: 'From successful payments',
      color: 'text-emerald-600 bg-emerald-500/10',
    },
    {
      label: 'Total Transactions',
      value: payments.length,
      icon: Receipt,
      description: 'Successful transactions',
      color: 'text-blue-600 bg-blue-500/10',
    },
    {
      label: 'Student Pro',
      value: studentPayments,
      icon: Users,
      description: 'Student subscriptions',
      color: 'text-purple-600 bg-purple-500/10',
    },
    {
      label: 'Tutor Pro',
      value: tutorPayments,
      icon: CreditCard,
      description: 'Tutor subscriptions',
      color: 'text-orange-600 bg-orange-500/10',
    },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">Administration</p>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Payments & Transactions
            </h1>

            <p className="mt-2 text-sm text-muted sm:text-base">
              Monitor platform revenue and manage subscription transactions.
            </p>
          </div>

          <button
            onClick={fetchPayments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-surface p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted">{stat.label}</p>

                  <div className={`rounded-lg p-2.5 ${stat.color}`}>
                    <Icon size={19} />
                  </div>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-foreground">{stat.value}</h2>

                <p className="mt-1 text-xs text-muted">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Payment History */}
        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="space-y-5 border-b border-border p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>

              <p className="mt-1 text-sm text-muted">
                View and search all successful platform payments.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, transaction ID..."
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary sm:w-44"
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="tutor">Tutors</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                Showing {filteredPayments.length} of {payments.length} transactions
              </span>

              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Successful payments
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="space-y-4 p-5 sm:p-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-lg bg-background" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center px-5 py-16 text-center">
              <p className="font-medium text-red-500">{error}</p>

              <button
                onClick={fetchPayments}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-16 text-center">
              <div className="mb-4 rounded-full bg-background p-4">
                <Receipt size={28} className="text-muted" />
              </div>

              <h3 className="font-semibold text-foreground">
                {payments.length === 0 ? 'No transactions yet' : 'No matching transactions'}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-muted">
                {payments.length === 0
                  ? 'Successful subscription payments will appear here.'
                  : 'Try changing your search or user filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left">
                <thead className="bg-background">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Payment Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.stripeSessionId || payment.transactionId}
                      className="transition hover:bg-background/70"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-foreground">
                          {payment.userName || 'Unknown User'}
                        </p>

                        <p className="mt-1 text-xs text-muted">{payment.userEmail}</p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            roleStyles[payment.userRole] || 'bg-background text-muted'
                          }`}
                        >
                          {payment.userRole}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-foreground">{payment.planName}</p>

                        <p className="mt-1 text-xs text-muted">Pro Membership</p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-foreground">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p
                          title={payment.transactionId}
                          className="max-w-44 truncate font-mono text-xs text-muted"
                        >
                          {payment.transactionId || 'N/A'}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <CalendarDays size={15} className="text-muted" />
                          {formatDate(payment.paidAt)}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium capitalize text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={13} />
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Footer Information */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ArrowUpRight size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Payment information</p>

            <p className="mt-1 text-xs leading-relaxed text-muted">
              This page displays successful subscription transactions recorded through Stripe.
              Revenue is calculated from the stored payment records.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
