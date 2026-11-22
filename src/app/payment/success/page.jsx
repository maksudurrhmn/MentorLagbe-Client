'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 size={42} />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">Thank You!</h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Your checkout process has completed. Stripe is confirming your payment. Your Pro plan will
          be activated once our server verifies the payment.
        </p>

        <div className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <ShieldCheck size={18} />
          <span>Secure payment verification</span>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Go to Dashboard
          <ArrowRight size={18} />
        </Link>

        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-gray-500 transition hover:text-blue-600 dark:text-gray-400"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
