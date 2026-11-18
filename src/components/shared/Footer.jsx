import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="rounded-xl bg-primary p-2 text-white">
                <GraduationCap size={22} />
              </span>
              <span className="text-xl font-bold tracking-tight">
                Mentor<span className="text-primary">Lagbe</span>
              </span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Connecting students with the right tutors and helping educators discover meaningful
              teaching opportunities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Explore</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <Link href="/tutors" className="hover:text-primary">
                Find Tutors
              </Link>
              <Link href="/tuitions" className="hover:text-primary">
                Find Tuition
              </Link>
              <Link href="/register" className="hover:text-primary">
                Join MentorLagbe
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <p>Built to connect, teach, and grow.</p>
        </div>
      </div>
    </footer>
  );
}
