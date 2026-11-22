import { BookOpen, Users, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Find the Right Tuition',
    description:
      'Explore tuition opportunities that match your subject, class, and learning preferences.',
  },
  {
    icon: Users,
    title: 'Connect with Tutors',
    description: 'Connect with tutors and find the right guidance for your learning journey.',
  },
  {
    icon: ShieldCheck,
    title: 'A Trusted Platform',
    description: 'A simple platform designed to make finding and managing tuition easier.',
  },
];

export default function FeaturesSection() {
  return (
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
  );
}
