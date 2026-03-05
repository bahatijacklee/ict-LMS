'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail } from '@/lib/utils';
import { Loader } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await login({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center px-md">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-2xl">
          <Link href="/" className="inline-flex items-center gap-base mb-lg">
            <div className="w-12 h-12 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <span className="font-bold text-2xl text-neutral-900">Baptist ERP</span>
          </Link>
          <h1 className="text-h2 font-bold text-neutral-900 mt-lg">Welcome Back</h1>
          <p className="text-neutral-600 mt-base">Sign in to your campus portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-xl space-y-md">
          {/* Error Banner */}
          {error && (
            <div className="p-md bg-error-light border border-error text-error rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-sm">
            <label htmlFor="email" className="block text-label font-semibold text-neutral-900">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-md py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-all ${
                formErrors.email ? 'border-error ring-2 ring-error-light' : 'border-neutral-300'
              }`}
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? 'email-error' : undefined}
            />
            {formErrors.email && (
              <span id="email-error" className="text-sm text-error">
                {formErrors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="space-y-sm">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-label font-semibold text-neutral-900">
                Password
              </label>
              <Link href="/forgot-password" className="text-label text-brand hover:text-brand-dark">
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-md py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand transition-all ${
                formErrors.password ? 'border-error ring-2 ring-error-light' : 'border-neutral-300'
              }`}
              aria-invalid={!!formErrors.password}
              aria-describedby={formErrors.password ? 'password-error' : undefined}
            />
            {formErrors.password && (
              <span id="password-error" className="text-sm text-error">
                {formErrors.password}
              </span>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-base">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-neutral-300 text-brand focus:ring-brand"
            />
            <label htmlFor="rememberMe" className="text-sm text-neutral-600">
              Keep me signed in
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Help Text */}
          <div className="text-center text-small text-neutral-600 space-y-sm">
            <p>Demo Credentials:</p>
            <div className="bg-neutral-50 p-base rounded-lg space-y-xs text-xs">
              <p>
                <strong>Student:</strong> student@baptist.ac.ke / password
              </p>
              <p>
                <strong>Instructor:</strong> instructor@baptist.ac.ke / password
              </p>
              <p>
                <strong>Finance:</strong> finance@baptist.ac.ke / password
              </p>
            </div>
          </div>
        </form>

        {/* Back to Home */}
        <div className="text-center mt-lg">
          <Link
            href="/"
            className="text-brand hover:text-brand-dark transition-colors font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
