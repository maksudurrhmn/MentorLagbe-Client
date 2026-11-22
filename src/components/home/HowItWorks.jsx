import Link from 'next/link';
import { UserPlus, Search, MessageSquare, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up as a student or tutor and create your profile in just a few steps.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Find the Right Match',
    description: 'Explore tuition opportunities or discover students looking for the right tutor.',
  },
  {
    number: '03',
    icon: MessageSquare,
    title: 'Connect and Get Started',
    description: 'Apply for a tuition or review applications to start your learning journey.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get started in three simple steps.
          </h2>

          <p className="mt-5 leading-7 text-muted">
            Whether you are looking for a tutor or teaching opportunities, MentorLagbe makes the
            process simple.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-border bg-surface p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/20"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-xl bg-blue-50 p-3 text-primary dark:bg-blue-950">
                    <Icon size={25} />
                  </div>

                  <span className="text-4xl font-bold text-border">{step.number}</span>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-foreground">{step.title}</h3>

                <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
