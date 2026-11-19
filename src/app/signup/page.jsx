'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import {
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);

    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
        role,
      });

      if (error) {
        setErrorMessage(error.message || 'Registration failed.');
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

  console.log(handleSubmit());

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <main className="min-h-dvh bg-background px-4 py-12 text-foreground">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl lg:grid-cols-2">
        {/* Left side */}
        <div className="hidden flex-col justify-between bg-primary p-10 text-white lg:flex">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <GraduationCap size={30} />
              MentorLagbe
            </div>

            <h1 className="mt-16 text-4xl font-bold leading-tight">
              Your next learning journey starts here.
            </h1>

            <p className="mt-5 leading-7 text-blue-100">
              Connect with the right people, discover opportunities, and make learning more
              meaningful.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm leading-6 text-blue-50">
              Whether you're looking for guidance or sharing your knowledge, there's a place for you
              here.
            </p>
          </div>
        </div>

        {/* Signup form */}
        <div className="p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <Link href="/" className="text-sm font-medium text-muted transition hover:text-primary">
              ← Back to home
            </Link>

            <h2 className="mt-8 text-3xl font-bold">Create your account</h2>

            <p className="mt-2 text-sm text-muted">Join MentorLagbe and get started today.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">Full name</label>
                <div className="relative">
                  <UserRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium">I want to join as</label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === 'student'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <BookOpen className="mb-3 text-primary" size={22} />
                    <span className="block font-semibold">Student</span>
                    <span className="mt-1 block text-xs text-muted">Find a tutor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('tutor')}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === 'tutor'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <GraduationCap className="mb-3 text-primary" size={22} />
                    <span className="block font-semibold">Tutor</span>
                    <span className="mt-1 block text-xs text-muted">Teach students</span>
                  </button>
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
                    placeholder="Create a password"
                    required
                    minLength={6}
                    className={`${inputClass} pl-11 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="mb-2 block text-sm font-medium">Confirm password</label>
                <div className="relative">
                  <LockKeyhole
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    size={18}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    className={`${inputClass} pl-11 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
