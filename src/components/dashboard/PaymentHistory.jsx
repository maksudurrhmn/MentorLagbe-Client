'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Receipt,
  CalendarDays,
  RefreshCw,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

const formatCurrency = (amount, currency = 'usd') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount || 0);

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

export default function PaymentHistory({ role }) {
  const [payments, setPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [plan, setPlan] = useState('free');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiRequest('/api/payments/my');

      setPayments(response?.data?.payments || []);
      setTotalPaid(response?.data?.totalPaid || 0);
      setPlan(response?.data?.plan || 'free');
    } catch (err) {
      setError(err.message || 'Unable to load payment history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const isPro = plan === 'pro';

  const stats = [
    {
      label: 'Total Paid',
      value: formatCurrency(totalPaid),
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-500/10',
    },
    {
      label: 'Transactions',
      value: payments.length,
      icon: Receipt,
      color: 'text-blue-600 bg-blue-500/10',
    },
    {
      label: 'Current Plan',
      value: isPro ? 'Pro' : 'Free',
      icon: CreditCard,
      color: 'text-purple-600 bg-purple-500/10',
    },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">
              {role === 'student' ? 'Student Dashboard' : 'Tutor Dashboard'}
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Payment History
            </h1>

            <p className="mt-2 text-sm text-muted sm:text-base">
              View your subscription payments and transaction details.
            </p>
          </div>

          <button
            onClick={fetchPayments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-background disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Current Plan */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <CreditCard size={24} />
            </div>

            <div>
              <p className="text-sm text-muted">Your current membership</p>
              <h2 className="mt-1 text-xl font-bold text-foreground">
                {loading
                  ? 'Loading...'
                  : isPro
                    ? `${role === 'student' ? 'Student' : 'Tutor'} Pro`
                    : 'Free Plan'}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {isPro
                  ? 'You currently have an active Pro plan.'
                  : 'You are currently using the free plan.'}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
              isPro
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-background text-muted'
            }`}
          >
            {isPro ? 'Pro Member' : 'Free Member'}
          </span>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
              </div>
            );
          })}
        </div>

        {/* Transaction History */}
        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
            <p className="mt-1 text-sm text-muted">Your successful subscription transactions.</p>
          </div>

          {loading ? (
            <div className="space-y-4 p-5 sm:p-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-lg bg-background" />
              ))}
            </div>
          ) : error ? (
            <div className="px-5 py-16 text-center">
              <p className="text-sm font-medium text-red-500">{error}</p>
              <button
                onClick={fetchPayments}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-16 text-center">
              <div className="mb-4 rounded-full bg-background p-4">
                <Receipt size={28} className="text-muted" />
              </div>

              <h3 className="font-semibold text-foreground">No payments yet</h3>

              <p className="mt-2 max-w-sm text-sm text-muted">
                Your successful Pro subscription payments will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-background">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Payment Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {payments.map((payment) => (
                    <tr
                      key={payment.stripeSessionId || payment.transactionId}
                      className="transition hover:bg-background/70"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-foreground">
                          {payment.planName || 'Pro Membership'}
                        </p>
                        <p className="mt-1 text-xs capitalize text-muted">
                          {payment.userRole} subscription
                        </p>
                      </td>

                      <td className="px-6 py-5 font-semibold text-foreground">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>

                      <td className="px-6 py-5">
                        <p
                          title={payment.transactionId}
                          className="max-w-48 truncate font-mono text-xs text-muted"
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
                          {payment.paymentStatus || 'paid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Clock size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Payment information</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Only successfully verified subscription payments are displayed in your transaction
              history.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
