'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, GraduationCap, Mail, LockKeyhole, ArrowRight } from 'lucide-react';
import { signIn } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);

    const email = formData.get('email');
    const password = formData.get('password');

    setIsSubmitting(true);

    try {
      const { error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || 'Invalid email or password.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-foreground">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl lg:min-h-150 lg:grid-cols-2">
        {/* Left side */}
        <div className="hidden flex-col justify-between bg-primary p-10 text-white lg:flex">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <GraduationCap size={30} />
              MentorLagbe
            </div>

            <h1 className="mt-16 text-4xl font-bold leading-tight">
              Welcome back to your learning journey.
            </h1>

            <p className="mt-5 leading-7 text-blue-100">
              Sign in to connect with tutors, discover opportunities, and continue making progress.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm leading-6 text-blue-50">
              Your next opportunity could be just one connection away.
            </p>
          </div>
        </div>

        {/* Login form */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="text-sm font-medium text-muted transition hover:text-primary">
              ← Back to home
            </Link>

            <h2 className="mt-6 text-3xl font-bold">Welcome back</h2>

            <p className="mt-2 text-sm text-muted">Sign in to your MentorLagbe account.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">Email address</label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">Password</label>

                <div className="relative">
                  <LockKeyhole
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    size={18}
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className={`${inputClass} pl-11 pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500"
                >
                  {errorMessage}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}

                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
