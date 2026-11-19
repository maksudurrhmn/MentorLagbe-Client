'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import ThemeToggle from './ThemeToggle';
import useAuth from '@/hooks/useAuth';
import { signOut } from '@/lib/auth-client';

const navLinks = [
  { label: 'Find Tutors', href: '/tutors' },
  { label: 'Find Tuition', href: '/tuitions' },
  { label: 'How It Works', href: '/#how-it-works' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, isLoading, isAuthenticated, role } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();

      if (error) {
        console.error('Logout failed:', error.message);
        return;
      }

      setIsOpen(false);
      router.push('/signin');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const authActions = (
    <>
      {isLoading ? (
        <div className="h-9 w-24 animate-pulse rounded-lg bg-surface" />
      ) : isAuthenticated ? (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">{user?.name || 'User'}</p>
            <p className="text-xs capitalize text-muted">{role || 'Member'}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-red-500 hover:text-red-500"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href="/signin"
            onClick={() => setIsOpen(false)}
            className="text-sm font-semibold text-foreground transition hover:text-primary"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
          Mentor<span className="text-primary">Lagbe</span>
          <span className="ml-1 text-primary">.</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          {authActions}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          className="rounded-lg p-2 text-foreground transition hover:bg-surface md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="border-t border-border bg-background px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-foreground transition hover:text-primary"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center justify-between border-t border-border pt-5">
              <ThemeToggle />
              {authActions}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
