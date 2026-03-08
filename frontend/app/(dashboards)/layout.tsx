'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  DollarSign,
  User,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Helper function to check if a link is active
  const isActivePath = (linkHref: string) => {
    // Normalize paths for comparison
    const normalizedLink = linkHref.toLowerCase();
    const normalizedPathname = pathname?.toLowerCase() || '';
    
    // Check if pathname starts with the link path
    return normalizedPathname.startsWith(normalizedLink);
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-md">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-neutral-200 border-t-brand rounded-full" />
          </div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Role-based navigation
  const getNavLinks = () => {
    if (user?.role === 'INSTRUCTOR') {
      return [
        { href: '/instructor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/instructor/courses', label: 'My Courses', icon: BookOpen },
        { href: '/instructor/profile', label: 'Profile', icon: User },
      ];
    }
    // Default to student navigation
    return [
      { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/student/courses', label: 'My Courses', icon: BookOpen },
      { href: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
      { href: '/student/fees', label: 'Fees', icon: DollarSign },
      { href: '/student/profile', label: 'Profile', icon: User },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-page">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 border-b border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-md">
          <div className="flex items-center gap-base">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-base hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="font-bold">Baptist ERP</span>
          </div>

          <div className="flex items-center gap-base">
            {user && (
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
                  {getInitials(user.first_name, user.last_name)}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 border-r border-neutral-200 bg-white
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:translate-x-0
          `}
        >
          {/* Logo */}
          <div className="p-lg border-b border-neutral-200 hidden lg:block">
            <Link href="/" className="flex items-center gap-base">
              <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="font-bold">Baptist ERP</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-md space-y-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActivePath(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-base px-md py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'nav-link-active' 
                      : 'text-neutral-600 hover:bg-brand-light hover:text-brand'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Card */}
          {user && (
            <div className="absolute bottom-0 left-0 right-0 p-md border-t border-neutral-200 bg-white space-y-md">
              <div className="flex items-center gap-base">
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                  {getInitials(user.first_name, user.last_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-neutral-600 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-sm px-md py-2 text-error hover:bg-error-light rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto lg:pb-0 pb-24">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
