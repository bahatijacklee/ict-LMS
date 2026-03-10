import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Shield,
  FileText,
  Lightbulb,
  MessageSquare,
  BarChart3,
  AlertCircle,
  Smartphone,
  Calendar,
  LogOut,
} from 'lucide-react';
import { ValuePropCard } from '@/components/landing/ValuePropCard';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { StepCard } from '@/components/landing/StepCard';
import { TestimonialCard } from '@/components/landing/TestimonialCard';
import { BenefitCard } from '@/components/landing/BenefitCard';
import { ResourceCard } from '@/components/landing/ResourceCard';
import { FAQ } from '@/components/landing/FAQ';

export default function Home() {
  // FAQ Data
  const faqItems = [
    {
      question: 'How do I enroll?',
      answer:
        'Enrollment is simple and takes just 5 minutes. Click "Start Your Journey" above, sign up with your email, fill in your basic information, and you\'re ready to explore courses and materials.',
    },
    {
      question: 'Is my data safe?',
      answer:
        'Yes. We use enterprise-grade security with JWT authentication, strict permissions, and audit-friendly workflows. Your data is protected with industry-leading security standards.',
    },
    {
      question: 'Can I access courses on my phone?',
      answer:
        'Absolutely! Baptist ICT is fully mobile-optimized. You can access all your courses, check grades, mark attendance, and manage payments from your smartphone anytime, anywhere.',
    },
    {
      question: 'Is there support available?',
      answer:
        'Yes, we provide 24/7 student support via chat and email. Our support specialists are always ready to help you with any questions or issues you might encounter.',
    },
    {
      question: 'What if I\'m having technical issues?',
      answer:
        'Our support team responds within 2 hours to any technical issues. In the meantime, check our knowledge base or live chat for immediate assistance.',
    },
    {
      question: 'Can I change my courses later?',
      answer:
        'Yes! You have full flexibility to adjust your course schedule anytime. Simply go to your dashboard and update your enrollment based on your changing needs.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-md py-md">
          <div className="flex items-center gap-base">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand shadow-md shadow-brand/20">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <span className="hidden text-lg font-bold sm:inline">Baptist ICT</span>
          </div>

          <nav className="hidden items-center gap-lg md:flex">
            <Link
              href="#features"
              className="nav-link-fancy text-neutral-600 transition-colors hover:text-brand"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="nav-link-fancy text-neutral-600 transition-colors hover:text-brand"
            >
              How It Works
            </Link>
            <Link
              href="#stories"
              className="nav-link-fancy text-neutral-600 transition-colors hover:text-brand"
            >
              Stories
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
              className="btn btn-primary"
            >
              Start Now
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== PHASE 1: HERO SECTION ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-light to-white py-2xl md:py-3xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-xl px-md md:grid-cols-2 lg:gap-2xl">
          {/* Left: Text Content */}
          <div className="space-y-lg animate-enter-up">
            {/* Badge */}
            <div className="badge-glow inline-flex items-center gap-sm rounded-full border border-brand/20 bg-white/70 px-4 py-2 text-sm font-medium text-brand backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              For Students, By Students at Heart
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold leading-tight text-neutral-900 md:text-5xl lg:text-6xl">
              Your Path to Academic Success{' '}
              <span className="hero-gradient-shift bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-xl text-lg text-neutral-600 leading-relaxed">
              Stop juggling multiple apps. Baptist ICT brings everything you need into one beautiful, intuitive platform. From course materials to grades, payments to schedules—it's all here.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-md pt-sm sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-sm rounded-lg bg-brand px-lg py-3 text-white font-semibold transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg"
              >
                Start Your Journey
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border-2 border-brand px-lg py-3 font-semibold text-brand transition-colors hover:bg-brand-light"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-sm pt-lg md:max-w-md">
              <div className="animate-enter-up rounded-lg border border-neutral-200 bg-white/70 p-md text-center backdrop-blur-sm [animation-delay:120ms]">
                <p className="text-xl font-bold text-brand">500+</p>
                <p className="text-xs text-neutral-600">Active Students</p>
              </div>
              <div className="animate-enter-up rounded-lg border border-neutral-200 bg-white/70 p-md text-center backdrop-blur-sm [animation-delay:220ms]">
                <p className="text-xl font-bold text-success">98%</p>
                <p className="text-xs text-neutral-600">Satisfaction Rate</p>
              </div>
              <div className="animate-enter-up rounded-lg border border-neutral-200 bg-white/70 p-md text-center backdrop-blur-sm [animation-delay:320ms]">
                <p className="text-xl font-bold text-accent">24/7</p>
                <p className="text-xs text-neutral-600">Support Available</p>
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative hidden md:block">
            <div className="animate-enter-scale relative mx-auto max-w-lg rounded-2xl border border-white/70 bg-white/85 p-lg shadow-2xl backdrop-blur-sm overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg"
                alt="Happy students studying together with Baptist ICT, enjoying campus life and collaborative learning"
                width={600}
                height={500}
                className="h-auto w-full object-cover rounded-lg"
                priority
              />

              {/* Floating Info Card 1 */}
              <div className="animate-float-soft absolute -left-8 top-8 rounded-xl border border-neutral-200 bg-white p-md shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Instant Access
                </p>
                <p className="text-sm font-bold text-neutral-900">
                  All courses in one place
                </p>
              </div>

              {/* Floating Info Card 2 */}
              <div className="animate-float-soft absolute -bottom-8 right-6 rounded-xl border border-neutral-200 bg-white p-md shadow-lg [animation-delay:800ms]">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Real-Time Updates
                </p>
                <p className="text-sm font-bold text-neutral-900">
                  Grades & notifications
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PHASE 1: WHY BAPTIST ICT SECTION ==================== */}
      <section className="bg-white py-2xl md:py-3xl">
        <div className="mx-auto max-w-7xl px-md">
          <div className="mb-2xl text-center space-y-base">
            <h2 className="text-4xl font-bold text-neutral-900 md:text-5xl">
              Why Baptist ICT is Right for You
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
              Designed specifically for students, with features that solve real problems in your academic life.
            </p>
          </div>

          {/* 3-Column Value Prop Grid */}
          <div className="grid gap-lg md:grid-cols-3">
            <ValuePropCard
              icon={Lightbulb}
              title="Simplify Your Campus Life"
              description="Stop juggling multiple systems. Everything you need—courses, grades, attendance, payments—is organized in one intuitive dashboard."
              href="#features"
            />
            <ValuePropCard
              icon={CheckCircle}
              title="Stay Organized"
              description="Never miss a deadline or grade again. Get automatic notifications for assignments, payment due dates, and important updates."
              href="#features"
            />
            <ValuePropCard
              icon={Smartphone}
              title="Learn Anywhere"
              description="Mobile-first design means you can manage your campus life from anywhere. Sync to your phone and stay on top of everything."
              href="#features"
            />
          </div>
        </div>
      </section>

      {/* ==================== PHASE 1: FEATURE CARDS SECTION ==================== */}
      <section
        id="features"
        className="relative overflow-hidden bg-neutral-50 py-3xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(0,102,204,0.08)_0%,rgba(0,102,204,0)_100%)]" />
        <div className="mx-auto max-w-7xl space-y-2xl px-md">
          <div className="space-y-base text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              What You'll Unlock
            </p>
            <h2 className="text-4xl font-bold text-neutral-900 md:text-5xl">
              Features Built for Your Success
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
              Everything you need to ace your classes and stay on top of your game.
            </p>
          </div>

          {/* 3x2 Feature Grid */}
          <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              image="https://images.pexels.com/photos/7974560/pexels-photo-7974560.jpeg"
              imageAlt="Student accessing course materials on laptop"
              title="Instant Access to Courses"
              description="Get instant access to all course materials, schedules, and assignments. Everything is organized by class and due date."
              href="#"
            />
            <FeatureCard
              image="https://images.pexels.com/photos/8443183/pexels-photo-8443183.jpeg"
              imageAlt="Student checking grades on mobile device"
              title="Track Your Grades in Real-Time"
              description="See your exam results and assignment grades as soon as they're posted. No more waiting or wondering how you did."
              href="#"
            />
            <FeatureCard
              image="https://images.pexels.com/photos/8704707/pexels-photo-8704707.jpeg"
              imageAlt="Student making payment online"
              title="Never Miss a Payment Deadline"
              description="Get smart reminders for payment due dates. Pay easily via M-Pesa, bank transfer, cash, or cheque with one-click payment tracking."
              href="#"
            />
            <FeatureCard
              image="https://images.pexels.com/photos/7974089/pexels-photo-7974089.jpeg"
              imageAlt="Student marking attendance in class"
              title="Attendance Made Easy"
              description="Mark your attendance in seconds from your phone. No more paper forms or confusion about attendance records."
              href="#"
            />
            <FeatureCard
              image="https://images.pexels.com/photos/8704720/pexels-photo-8704720.jpeg"
              imageAlt="Student messaging instructor for help"
              title="Connect with Instructors"
              description="Message your teachers directly for help, clarification, or discussion. Get answers quickly without waiting for office hours."
              href="#"
            />
            <FeatureCard
              image="https://images.pexels.com/photos/7974600/pexels-photo-7974600.jpeg"
              imageAlt="Student calendar with class schedule"
              title="Stay on Top of Your Schedule"
              description="Sync your class calendar to your phone. Never miss a class, exam, or deadline. All your important dates in one place."
              href="#"
            />
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section id="how-it-works" className="bg-white py-3xl">
        <div className="mx-auto max-w-7xl px-md space-y-2xl">
          <div className="text-center space-y-base">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              Getting Started
            </p>
            <h2 className="text-4xl font-bold text-neutral-900 md:text-5xl">
              Sign Up in 4 Easy Steps
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
              Start your journey in minutes, not hours.
            </p>
          </div>

          {/* 4-Step Journey */}
          <div className="grid gap-lg md:grid-cols-4 py-lg">
            <StepCard
              stepNumber={1}
              icon={FileText}
              title="Sign Up"
              description="Create account with email in 2 minutes"
            />
            <div className="hidden md:flex items-center justify-center pb-8">
              <ArrowRight size={32} className="text-neutral-300" />
            </div>
            <StepCard
              stepNumber={2}
              icon={BookOpen}
              title="Explore"
              description="Browse all available courses and details"
            />
            <div className="hidden md:flex items-center justify-center pb-8">
              <ArrowRight size={32} className="text-neutral-300" />
            </div>
            <StepCard
              stepNumber={3}
              icon={CheckCircle}
              title="Enroll"
              description="Pick courses and complete enrollment"
            />
            <div className="hidden md:flex items-center justify-center pb-8">
              <ArrowRight size={32} className="text-neutral-300" />
            </div>
            <StepCard
              stepNumber={4}
              icon={TrendingUp}
              title="Learn"
              description="Access all courses and start succeeding"
            />
          </div>
        </div>
      </section>

      {/* ==================== SUCCESS STORIES SECTION ==================== */}
      <section id="stories" className="bg-neutral-50 py-3xl">
        <div className="mx-auto max-w-7xl px-md space-y-2xl">
          <div className="text-center space-y-base">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              Student Success
            </p>
            <h2 className="text-4xl font-bold text-neutral-900 md:text-5xl">
              Real Stories from Baptist ICT Students
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
              See how your peers are succeeding with Baptist ICT.
            </p>
          </div>

          {/* 3-Column Testimonials */}
          <div className="grid gap-lg md:grid-cols-3">
            <TestimonialCard
              quote="I improved my grades by 30% because everything is organized in one place. No more chasing emails or missing assignments!"
              studentName="Sarah K."
              studentYear="Year 2"
              studentMajor="Computer Science"
              avatarUrl="https://i.pravatar.cc/64?u=sarah"
              rating={5}
            />
            <TestimonialCard
              quote="The attendance tracking is so easy. My parents can see my progress in real-time. It's transparent and honest."
              studentName="James M."
              studentYear="Year 1"
              studentMajor="Business Administration"
              avatarUrl="https://i.pravatar.cc/64?u=james"
              rating={5}
            />
            <TestimonialCard
              quote="No more missed deadlines! The notifications are perfect. I'm never stressed about payments or submission dates anymore."
              studentName="Amara T."
              studentYear="Year 3"
              studentMajor="Engineering"
              avatarUrl="https://i.pravatar.cc/64?u=amara"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* ==================== BENEFITS GRID SECTION ==================== */}
      <section className="bg-white py-3xl">
        <div className="mx-auto max-w-7xl px-md space-y-2xl">
          <div className="text-center space-y-base">
            <h2 className="text-4xl font-bold text-neutral-900 md:text-5xl">
              Why Students Love Baptist ICT
            </h2>
          </div>

          {/* 2x3 Benefits Grid */}
          <div className="grid gap-lg md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              icon={BarChart3}
              title="Track Everything"
              description="One dashboard for your grades, courses, payments, and attendance. See your progress at a glance."
            />
            <BenefitCard
              icon={AlertCircle}
              title="Never Miss Important Info"
              description="Automatic notifications ensure you always know about deadlines, grades, and important updates."
            />
            <BenefitCard
              icon={Smartphone}
              title="Learn Anywhere"
              description="Mobile-first design means full access from your phone. Study and manage your courses on the go."
            />
            <BenefitCard
              icon={MessageSquare}
              title="Talk to Your Instructors"
              description="Direct messaging with professors for quick answers and academic support anytime you need it."
            />
            <BenefitCard
              icon={Calendar}
              title="Stay Organized"
              description="Synced calendar with all your classes, exams, and deadlines. Never forget an important date."
            />
            <BenefitCard
              icon={LogOut}
              title="Save Time & Money"
              description="No more chasing emails or missing payments. Stay organized and focus on what matters—your studies."
            />
          </div>
        </div>
      </section>

      {/* ==================== RESOURCES SECTION ==================== */}
      <section className="bg-neutral-50 py-3xl">
        <div className="mx-auto max-w-7xl px-md space-y-2xl">
          <div className="text-center space-y-base">
            <h2 className="text-4xl font-bold text-neutral-900 md:text-5xl">
              Everything You Need to Get Started
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
              We've got resources to help you succeed from day one.
            </p>
          </div>

          {/* 2x2 Resources Grid */}
          <div className="grid gap-lg md:grid-cols-2">
            <ResourceCard
              icon={FileText}
              title="New Student Guide"
              description="Step-by-step walkthrough of all Baptist ICT features and how to use them."
              linkText="Download PDF"
              href="#"
            />
            <ResourceCard
              icon={BookOpen}
              title="Video Tutorial (5 min)"
              description="See Baptist ICT in action. Quick walkthrough of key features and interface."
              linkText="Watch Video"
              href="#"
            />
            <ResourceCard
              icon={AlertCircle}
              title="FAQ Section"
              description="Find answers to the most common questions students ask about Baptist ICT."
              linkText="View FAQ"
              href="#faq"
            />
            <ResourceCard
              icon={MessageSquare}
              title="Live Chat Support"
              description="Talk to a student support specialist who can answer your questions in real-time."
              linkText="Start Chat"
              href="#"
            />
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section id="faq" className="bg-white py-3xl">
        <div className="mx-auto max-w-3xl px-md space-y-2xl">
          <div className="text-center space-y-base">
            <h2 className="text-4xl font-bold text-neutral-900 md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600">
              Got questions? We have answers.
            </p>
          </div>

          <FAQ items={faqItems} />
        </div>
      </section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <section className="relative overflow-hidden bg-brand py-2xl text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.2),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(249,115,22,0.25),transparent_38%)]" />
        <div className="relative mx-auto max-w-4xl space-y-lg px-md text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-lg text-brand-light">
            Join 500+ students who are already managing their academic life with Baptist ICT.{' '}
            <strong>It's free to start.</strong>
          </p>

          <div className="flex flex-col justify-center gap-md pt-sm sm:flex-row">
            <Link
              href="/login"
              className="cta-button-shine inline-flex items-center justify-center gap-sm rounded-lg bg-white px-lg py-3 font-semibold text-brand transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              Enroll Now - It's Free
              <ArrowRight size={20} />
            </Link>
            <Link
              href="#"
              className="rounded-lg border-2 border-white px-lg py-3 font-semibold text-white transition-all hover:-translate-y-1 hover:bg-white hover:text-brand hover:shadow-xl"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-neutral-900 px-md py-2xl text-white">
        <div className="mx-auto mb-2xl grid max-w-7xl gap-lg md:grid-cols-5">
          <div className="space-y-base">
            <div className="flex items-center gap-base">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <span className="font-bold text-neutral-900">B</span>
              </div>
              <span className="text-lg font-bold">Baptist ICT</span>
            </div>
            <p className="text-sm text-neutral-400">
              Empowering students to succeed, one platform at a time.
            </p>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-sm text-sm text-neutral-400">
              <li>
                <Link
                  href="#features"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-sm text-sm text-neutral-400">
              <li>
                <Link
                  href="#"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-sm text-sm text-neutral-400">
              <li>
                <Link
                  href="#"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  Student Guide
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-base">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-sm text-sm text-neutral-400">
              <li>
                <Link
                  href="/privacy"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="footer-link-fancy transition-colors hover:text-white"
                >
                  Cookie Policy
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
