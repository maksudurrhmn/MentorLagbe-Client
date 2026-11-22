import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="rounded-xl bg-primary p-2 text-white">
                <GraduationCap size={22} />
              </span>

              <span className="text-xl font-bold tracking-tight text-foreground">
                Mentor<span className="text-primary">Lagbe</span>
              </span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-muted">
              Connecting students with the right tutors and helping educators discover meaningful
              teaching opportunities.
            </p>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="font-semibold text-foreground">Explore</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <Link href="/tuitions" className="transition hover:text-primary">
                Exprole Tuition
              </Link>

              <Link href="/signup" className="transition hover:text-primary">
                Join MentorLagbe
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row">
          <p>©2026 MentorLagbe. All rights reserved.</p>

          <p>Built to connect, teach, and grow.</p>
        </div>
      </div>
    </footer>
  );
}
