import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-900/20" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl dark:bg-indigo-900/20" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 text-center sm:py-32 lg:px-8">
        <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-primary dark:border-blue-900 dark:bg-blue-950">
          A better way to connect and learn
        </span>

        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Find the right mentor.
          <span className="block text-primary">Build a brighter future.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          Whether you're looking for the perfect tutor or your next teaching opportunity,
          MentorLagbe brings students and educators together.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Explore Tuitions
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
