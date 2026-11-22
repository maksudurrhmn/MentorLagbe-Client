import Link from 'next/link';
import { ArrowLeft, Home, Search, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] items-center justify-center px-6 py-20">
      <div className="mx-auto w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SearchX size={32} strokeWidth={1.8} />
        </div>

        <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
          Error 404
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Oops! Page not found.
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground">
          The page you're looking for may have been moved, deleted, or never existed. Let's help you
          find your way back.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <Link
            href="/tuitions"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <Search size={17} />
            Browse Tuitions
          </Link>
        </div>
      </div>
    </main>
  );
}
