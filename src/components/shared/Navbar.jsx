'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  UserRound,
  LogOut,
  GraduationCap,
} from 'lucide-react';

import ThemeToggle from './ThemeToggle';
import useAuth from '@/hooks/useAuth';
import { signOut } from '@/lib/auth-client';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Browse Tuitions', href: '/tuitions' },
  { name: 'Pricing', href: '/pricing' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoading, isAuthenticated, role } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileRef = useRef(null);

  const dashboardHref = `/dashboard/${role || 'student'}`;

  const initials = (user?.name || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  // Close profile dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const { error } = await signOut();

      if (error) {
        console.error('Logout failed:', error.message);
        return;
      }

      closeMenus();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActiveLink = (href) => {
    if (href === '/') return pathname === '/';

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderLink = (link) => (
    <Link
      key={link.href}
      href={link.href}
      onClick={closeMenus}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        isActiveLink(link.href) ? 'text-primary' : 'text-foreground/70'
      }`}
    >
      {link.name}
    </Link>
  );

  const ProfileAvatar = ({ size = 'h-9 w-9' }) =>
    user?.image ? (
      <img
        src={user.image}
        alt={user.name || 'User'}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    ) : (
      <span
        className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white`}
      >
        {initials || 'U'}
      </span>
    );

  const ProfileOptions = () => (
    <>
      <Link
        href={dashboardHref}
        onClick={closeMenus}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-surface"
      >
        <LayoutDashboard size={17} />
        Dashboard
      </Link>

      <Link
        href="/dashboard/profile"
        onClick={closeMenus}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-surface"
      >
        <UserRound size={17} />
        My Profile
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-surface disabled:opacity-50 cursor-pointer"
      >
        <LogOut size={17} />
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="inline-flex items-center gap-1 text-2xl font-bold tracking-tight text-foreground"
        >
          <span className="rounded-xl bg-primary p-2 text-white">
            <GraduationCap size={18} />
          </span>
          Mentor<span className="text-primary">Lagbe</span>
          <span className="text-primary">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">{navLinks.map(renderLink)}</div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Desktop Authentication */}
          <div className="hidden items-center gap-3 sm:flex">
            {isLoading ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-surface" />
            ) : isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                  className="flex items-center gap-2 rounded-full border border-border p-1 pr-3 transition hover:bg-surface-secondary"
                >
                  <ProfileAvatar />

                  <span className="max-w-24 truncate text-sm font-medium text-foreground">
                    {user?.name || 'Account'}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border border-border bg-background p-2 shadow-xl">
                    <div className="border-b border-border px-3 py-3">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user?.name || 'User'}
                      </p>
                      <p className="truncate text-xs text-muted">{user?.email}</p>
                      <p className="mt-1 text-xs capitalize text-primary">{role || 'Member'}</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <ProfileOptions />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-sm font-medium text-foreground transition hover:text-primary"
                >
                  Log in
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-surface-secondary md:hidden"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {/* Navigation Links */}
            {navLinks.map(renderLink)}

            {/* Mobile Authentication */}
            {!isLoading && (
              <>
                {!isAuthenticated ? (
                  <div className="flex items-center gap-4 border-t border-border pt-4">
                    <Link
                      href="/signin"
                      onClick={closeMenus}
                      className="text-sm font-medium text-foreground hover:text-primary"
                    >
                      Log in
                    </Link>

                    <Link
                      href="/signup"
                      onClick={closeMenus}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <div className="border-t border-border pt-4">
                    {/* Mobile Profile Options */}
                    <div className="space-y-1">
                      <ProfileOptions />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
