import Link from 'next/link';
import { ArrowRight, BookOpen, Users, TrendingUp, Shield, Clock, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-md py-md flex items-center justify-between">
          <div className="flex items-center gap-base">
            <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Baptist ICT</span>
          </div>

          <nav className="hidden md:flex items-center gap-lg">
            <Link href="#features" className="text-neutral-600 hover:text-brand transition-colors">
              Features
            </Link>
            <Link href="#courses" className="text-neutral-600 hover:text-brand transition-colors">
              Courses
            </Link>
            <Link href="/about" className="text-neutral-600 hover:text-brand transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-sm">
            <Link
              href="/login"
              className="px-md py-2 text-brand hover:bg-brand-light rounded-md transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-md py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-light via-white to-white py-2xl px-md md:py-3xl">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-xl items-center">
          <div className="space-y-lg">
            <h1 className="text-h1 md:text-5xl font-bold text-neutral-900">
              Empower Learning.
              <br />
              <span className="text-brand">Simplify Management.</span>
            </h1>
            <p className="text-lg text-neutral-600">
              Baptist ICT's unified campus portal connecting students, instructors, and administrators in one seamless platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-md pt-lg">
              <Link
                href="/login"
                className="px-lg py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-all hover:shadow-lg flex items-center justify-center gap-sm"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link
                href="#features"
                className="px-lg py-3 border-2 border-brand text-brand rounded-lg hover:bg-brand-light transition-colors flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-brand to-brand-dark rounded-xl p-xl text-white flex items-center justify-center h-96">
              <div className="text-center space-y-md">
                <Users size={64} className="mx-auto" />
                <p className="text-xl font-semibold">Connected Campus</p>
                <p className="text-brand-light">500+ Students Active</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-3xl px-md bg-neutral-50">
        <div className="max-w-7xl mx-auto space-y-2xl">
          <div className="text-center space-y-base">
            <h2 className="text-h2 md:text-4xl font-bold text-neutral-900">Core Features</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Everything you need to manage a modern educational institution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-lg">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-brand-light flex items-center justify-center mb-md">
                <BookOpen size={24} className="text-brand" />
              </div>
              <h3 className="text-h3 font-bold mb-base">Dashboard at a Glance</h3>
              <p className="text-neutral-600">
                Students see enrolled courses. Instructors see assigned batches. Finance tracks revenue in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-success-light flex items-center justify-center mb-md">
                <Clock size={24} className="text-success" />
              </div>
              <h3 className="text-h3 font-bold mb-base">Instant Attendance</h3>
              <p className="text-neutral-600">
                Mark attendance in seconds. No paperwork. Automatic record keeping for compliance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-md">
                <TrendingUp size={24} className="text-accent" />
              </div>
              <h3 className="text-h3 font-bold mb-base">Payments Made Easy</h3>
              <p className="text-neutral-600">
                M-Pesa, bank transfer, cash, or cheque. Track payments, send reminders, and generate receipts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-warning-light flex items-center justify-center mb-md">
                <Users size={24} className="text-warning" />
              </div>
              <h3 className="text-h3 font-bold mb-base">Role-Based Access</h3>
              <p className="text-neutral-600">
                Students, Instructors, Finance, IT Admin, and Super Admin. Each sees what they need.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-error-light flex items-center justify-center mb-md">
                <Shield size={24} className="text-error" />
              </div>
              <h3 className="text-h3 font-bold mb-base">Enterprise Security</h3>
              <p className="text-neutral-600">
                JWT authentication, encrypted passwords, audit logs, and role-based permissions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-brand-light flex items-center justify-center mb-md">
                <CheckCircle size={24} className="text-brand" />
              </div>
              <h3 className="text-h3 font-bold mb-base">Automated Reports</h3>
              <p className="text-neutral-600">
                Revenue by student, by payment method, by date range. Export to CSV in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-2xl px-md bg-brand text-white">
        <div className="max-w-4xl mx-auto text-center space-y-lg">
          <h2 className="text-h2 md:text-4xl font-bold">Ready to Transform Your Campus?</h2>
          <p className="text-lg text-brand-light">
            Join hundreds of students and instructors using Baptist ICT's unified platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-md justify-center pt-lg">
            <Link
              href="/login"
              className="px-lg py-3 bg-white text-brand rounded-lg hover:bg-brand-light transition-all font-semibold flex items-center justify-center gap-sm"
            >
              Start Now <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="px-lg py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-brand transition-colors font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-2xl px-md">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-lg mb-2xl">
          <div className="space-y-base">
            <div className="flex items-center gap-base">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-neutral-900 font-bold">B</span>
              </div>
              <span className="font-bold text-lg">Baptist ERP</span>
            </div>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-sm text-neutral-400 text-sm">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-sm text-neutral-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-sm text-neutral-400 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-2xl text-center text-neutral-400 text-sm">
          <p>&copy; 2026 Baptist ICT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
