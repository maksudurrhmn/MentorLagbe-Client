'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <XCircle size={42} />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">Payment Cancelled</h1>

        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Your checkout was cancelled. No payment was completed, and your current plan remains
          unchanged. You can try again whenever you're ready.
        </p>

        <Link
          href="/pricing"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <CreditCard size={18} />
          Return to Pricing
        </Link>

        <Link
          href="/"
          className="mt-4 inline-flex items-center justify-center gap-1 text-sm font-medium text-gray-500 transition hover:text-blue-600 dark:text-gray-400 hover:gap-3"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
