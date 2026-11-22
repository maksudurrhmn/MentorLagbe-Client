'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, ShieldCheck, LoaderCircle } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { apiRequest } from '@/lib/api';

const plans = [
  {
    role: 'student',
    name: 'Student Pro',
    description: 'Get more opportunities to find the right tutor.',
    price: 10,
    features: [
      'Apply for tuition opportunities',
      'Access to your application history',
      'Manage your mentorship journey',
      'Pro membership status',
    ],
  },
  {
    role: 'tutor',
    name: 'Tutor Pro',
    description: 'Grow your tutoring opportunities without limits.',
    price: 15,
    features: [
      'Unlimited tuition posts',
      'Manage multiple tuition opportunities',
      'Access applicant information',
      'Pro membership status',
    ],
  },
];

export default function PricingPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);

        const response = await apiRequest('/api/users/profile');

        if (active) {
          setProfile(response?.data || null);
        }
      } catch {
        if (active) {
          setProfile(null);
        }
      } finally {
        if (active) {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, [user]);

  const handleCheckout = async (planRole) => {
    setError('');

    if (!user) {
      window.location.href = '/signin';
      return;
    }

    if (profile?.role === 'admin') {
      setError('Admin accounts cannot purchase Pro memberships.');
      return;
    }

    if (profile?.role !== planRole) {
      setError(
        `The ${planRole === 'student' ? 'Student' : 'Tutor'} Pro plan is only available to ${planRole}s.`
      );
      return;
    }

    if (profile?.plan === 'pro') {
      setError('You already have an active Pro membership.');
      return;
    }

    try {
      setCheckoutLoading(planRole);

      const response = await apiRequest('/api/payments/create-checkout-session', {
        method: 'POST',
      });

      const checkoutUrl = response?.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error('Unable to get the Stripe checkout URL.');
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      setError(err.message || 'Unable to start checkout. Please try again.');
      setCheckoutLoading('');
    }
  };

  const isLoggedIn = Boolean(user);
  const userRole = profile?.role || user?.role;
  const isPro = profile?.plan === 'pro';

  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles size={16} />
            Simple and transparent pricing
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Choose the plan that
            <span className="text-primary"> fits your journey.</span>
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted sm:text-base">
            Whether you are looking for a tutor or growing your tutoring career, MentorLagbe Pro
            gives you the tools to move forward.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mx-auto mt-8 max-w-2xl rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {plans.map((plan) => {
            const isEligible = userRole === plan.role;
            const isCurrentPlan = isLoggedIn && isEligible && isPro;
            const isLoading = checkoutLoading === plan.role;
            const isOtherRole = isLoggedIn && userRole !== 'admin' && !isEligible;

            let buttonLabel = 'Get Started';

            if (!isLoggedIn) {
              buttonLabel = 'Sign in to Continue';
            } else if (userRole === 'admin') {
              buttonLabel = 'Not Available for Admin';
            } else if (isCurrentPlan) {
              buttonLabel = 'Current Plan';
            } else if (isOtherRole) {
              buttonLabel = 'Not Your Plan';
            }

            return (
              <div
                key={plan.role}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-primary/40 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                      <Sparkles size={22} />
                    </div>

                    <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>

                    <p className="mt-2 text-sm leading-6 text-muted">{plan.description}</p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {plan.role === 'student' ? 'For Students' : 'For Tutors'}
                  </span>
                </div>

                <div className="my-7 flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    ${plan.price}
                  </span>

                  <span className="pb-1 text-sm text-muted">/ one-time payment</span>
                </div>

                <div className="mb-7 h-px bg-border" />

                <p className="mb-5 text-sm font-semibold text-foreground">What's included</p>

                <ul className="flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                      <span className="mt-0.5 rounded-full bg-emerald-500/10 p-1 text-emerald-600 dark:text-emerald-400">
                        <Check size={13} />
                      </span>

                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.role)}
                  disabled={
                    profileLoading ||
                    isLoading ||
                    isCurrentPlan ||
                    userRole === 'admin' ||
                    (isLoggedIn && !isEligible)
                  }
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Redirecting...
                    </>
                  ) : profileLoading && isLoggedIn ? (
                    'Loading...'
                  ) : (
                    <>
                      {buttonLabel}
                      {!isCurrentPlan && userRole !== 'admin' && (!isLoggedIn || isEligible) && (
                        <ArrowRight size={17} />
                      )}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Security Information */}
        <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-xl border border-border bg-surface p-5">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Secure payments with Stripe</h3>

            <p className="mt-1 text-xs leading-relaxed text-muted">
              Payments are processed through Stripe Checkout. Your Pro membership is activated only
              after the payment is verified by our server.
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-10 text-center text-sm text-muted">
          Have questions?{' '}
          <Link href="/" className="font-medium text-primary hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </main>
  );
}
