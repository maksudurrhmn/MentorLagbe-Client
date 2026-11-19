import Link from 'next/link';
import { ArrowRight, GraduationCap, Search, Users } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Find the Right Tutor',
    description: 'Discover tutors who match your learning needs, subjects, and preferences.',
  },
  {
    icon: GraduationCap,
    title: 'Explore Tuition Jobs',
    description: 'Find teaching opportunities that match your expertise and availability.',
  },
  {
    icon: Users,
    title: 'Connect and Grow',
    description: 'Build meaningful learning connections between students and educators.',
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
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
              href="/tutors"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
            >
              Find a Tutor
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/tuitions"
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface px-7 py-4 font-semibold text-foreground transition hover:border-primary hover:text-primary sm:w-auto"
            >
              Find Tuition
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Why MentorLagbe
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything starts with the right connection.
            </h2>

            <p className="mt-5 leading-7 text-muted">
              A simple platform designed to make finding tutors and teaching opportunities easier.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-background p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/20"
                >
                  <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary dark:bg-blue-950">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-foreground">{feature.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Get started
          </p>

          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            Your next opportunity starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted">
            Join MentorLagbe, create your account, and start exploring opportunities that fit your
            goals.
          </p>

          <Link
            href="/register"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
