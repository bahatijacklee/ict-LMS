import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Dashboard at a Glance',
    description:
      'Students see enrolled courses. Instructors see assigned batches. Finance tracks revenue in real-time.',
    accent: 'bg-brand-light text-brand',
  },
  {
    icon: Clock,
    title: 'Instant Attendance',
    description:
      'Mark attendance in seconds with automatic records for transparency and compliance.',
    accent: 'bg-success-light text-success',
  },
  {
    icon: TrendingUp,
    title: 'Payments Made Easy',
    description:
      'Track M-Pesa, bank transfer, cash, and cheque payments with streamlined verification.',
    accent: 'bg-accent-light text-accent',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description:
      'Students, instructors, finance, and admins each get a focused workspace with the right tools.',
    accent: 'bg-warning-light text-warning',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'JWT authentication, strict permissions, and audit-friendly workflows protect your institution.',
    accent: 'bg-error-light text-error',
  },
  {
    icon: CheckCircle,
    title: 'Automated Reports',
    description:
      'Generate revenue summaries and operational metrics quickly with export-ready outputs.',
    accent: 'bg-brand-light text-brand',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-md py-md">
          <div className="flex items-center gap-base">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand shadow-md shadow-brand/20">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <span className="hidden text-lg font-bold sm:inline">Baptist ICT</span>
          </div>

          <nav className="hidden items-center gap-lg md:flex">
            <Link href="#features" className="text-neutral-600 transition-colors hover:text-brand">
              Features
            </Link>
            <Link href="#impact" className="text-neutral-600 transition-colors hover:text-brand">
              Impact
            </Link>
            <Link href="/about" className="text-neutral-600 transition-colors hover:text-brand">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-sm">
            <Link
              href="/login"
              className="rounded-md px-md py-2 text-brand transition-colors hover:bg-brand-light"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-brand px-md py-2 text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,102,204,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.18),transparent_45%),linear-gradient(180deg,#f6fbff_0%,#ffffff_65%)] py-2xl md:py-3xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-xl px-md md:grid-cols-2">
          <div className="space-y-lg animate-enter-up">
            <div className="inline-flex items-center gap-sm rounded-full border border-brand/20 bg-white/70 px-4 py-2 text-sm font-medium text-brand backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              Unified Campus Operations Platform
            </div>

            <h1 className="text-h1 font-bold leading-tight text-neutral-900 md:text-5xl">
              Empower Learning.
              <br />
              <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
                Simplify Management.
              </span>
            </h1>

            <p className="max-w-xl text-lg text-neutral-600">
              Baptist ICT&apos;s unified portal connects students, instructors, and administrators to streamline
              attendance, grading, communication, and finance in one intelligent workspace.
            </p>

            <div className="flex flex-col gap-md pt-sm sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-sm rounded-lg bg-brand px-lg py-3 text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg"
              >
                Get Started
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border-2 border-brand px-lg py-3 text-brand transition-colors hover:bg-brand-light"
              >
                Explore Features
              </Link>
            </div>

            <div id="impact" className="grid grid-cols-3 gap-sm pt-md md:max-w-md">
              <div className="animate-enter-up rounded-lg border border-neutral-200 bg-white/70 p-md text-center backdrop-blur-sm [animation-delay:120ms]">
                <p className="text-xl font-bold text-brand">500+</p>
                <p className="text-xs text-neutral-600">Active Students</p>
              </div>
              <div className="animate-enter-up rounded-lg border border-neutral-200 bg-white/70 p-md text-center backdrop-blur-sm [animation-delay:220ms]">
                <p className="text-xl font-bold text-success">35+</p>
                <p className="text-xs text-neutral-600">Instructors</p>
              </div>
              <div className="animate-enter-up rounded-lg border border-neutral-200 bg-white/70 p-md text-center backdrop-blur-sm [animation-delay:320ms]">
                <p className="text-xl font-bold text-accent">98%</p>
                <p className="text-xs text-neutral-600">On-Time Records</p>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="animate-enter-scale relative mx-auto max-w-lg rounded-2xl border border-white/70 bg-white/85 p-lg shadow-2xl backdrop-blur-sm">
              <Image
                src="/images/landing-campus-dashboard.svg"
                alt="Baptist ICT dashboard illustration"
                width={720}
                height={520}
                className="h-auto w-full"
                priority
              />

              <div className="animate-float-soft absolute -left-8 top-8 rounded-xl border border-neutral-200 bg-white p-md shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Today</p>
                <p className="text-sm font-bold text-neutral-900">127 Attendance Marks</p>
              </div>

              <div className="animate-float-soft absolute -bottom-8 right-6 rounded-xl border border-neutral-200 bg-white p-md shadow-lg [animation-delay:800ms]">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Payments</p>
                <p className="text-sm font-bold text-neutral-900">KES 1.2M Collected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-neutral-50 py-3xl">
        <div className="mx-auto max-w-7xl space-y-2xl px-md">
          <div className="space-y-base text-center">
            <h2 className="text-h2 font-bold text-neutral-900 md:text-4xl">Core Features</h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
              Everything you need to operate a modern training institution from a single platform.
            </p>
          </div>

          <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="animate-enter-up rounded-xl border border-neutral-200 bg-white p-lg shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className={`mb-md flex h-12 w-12 items-center justify-center rounded-lg ${feature.accent}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-base text-h3 font-bold text-neutral-900">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand py-2xl text-white">
        <div className="mx-auto max-w-4xl space-y-lg px-md text-center">
          <h2 className="text-h2 font-bold md:text-4xl">Ready to Transform Your Campus?</h2>
          <p className="text-lg text-brand-light">
            Join hundreds of students and instructors using Baptist ICT&apos;s unified platform.
          </p>

          <div className="flex flex-col justify-center gap-md pt-sm sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-sm rounded-lg bg-white px-lg py-3 font-semibold text-brand transition-all hover:-translate-y-0.5 hover:bg-brand-light"
            >
              Start Now <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border-2 border-white px-lg py-3 font-semibold text-white transition-colors hover:bg-white hover:text-brand"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-neutral-900 px-md py-2xl text-white">
        <div className="mx-auto mb-2xl grid max-w-7xl gap-lg md:grid-cols-4">
          <div className="space-y-base">
            <div className="flex items-center gap-base">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <span className="font-bold text-neutral-900">B</span>
              </div>
              <span className="text-lg font-bold">Baptist ERP</span>
            </div>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-sm text-sm text-neutral-400">
              <li>
                <Link href="#features" className="transition-colors hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/security" className="transition-colors hover:text-white">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-sm text-sm text-neutral-400">
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="transition-colors hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-sm text-sm text-neutral-400">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-2xl text-center text-sm text-neutral-400">
          <p>&copy; 2026 Baptist ICT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
