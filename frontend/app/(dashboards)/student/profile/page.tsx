/**
 * Profile Edit Page
 * Edit student profile information
 */

'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail, isValidPhoneNumber, getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phone_number || '');
    }
  }, [user]);

  // Validate form
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format (use +254...)';
    }

    // Password validation (only if changing password)
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = 'Current password is required to set new password';
      }
      if (newPassword.length < 8) {
        newErrors.newPassword = 'New password must be at least 8 characters';
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Implement actual API call
      // await api.patch(`/users/${user?.id}/`, {
      //   first_name: firstName,
      //   last_name: lastName,
      //   email,
      //   phone_number: phoneNumber,
      //   ...(newPassword && { password: newPassword, old_password: currentPassword }),
      // });

      setSuccessMessage('Profile updated successfully!');
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text mb-2">My Profile</h1>
        <p className="text-body text-text-secondary">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
          <p className="text-body text-success">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
          <p className="text-body text-error">{errorMessage}</p>
        </div>
      )}

      {/* Profile Picture */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-text mb-4">Profile Picture</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-h1 font-bold">
              {getInitials(`${firstName} ${lastName}`)}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-body font-semibold text-text mb-1">
              {firstName} {lastName}
            </h3>
            <p className="text-small text-text-secondary mb-3">
              {user.role} • {user.username}
            </p>
            <button className="text-small text-primary hover:text-primary/80 font-medium">
              Upload new picture
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-text mb-6">Personal Information</h2>

        <div className="space-y-5">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-body font-medium text-text mb-2">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.firstName ? 'border-error' : 'border-gray-200 focus:border-primary'
                }`}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
            </div>
            {errors.firstName && (
              <p id="firstName-error" className="mt-1.5 text-small text-error">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-body font-medium text-text mb-2">
              Last Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.lastName ? 'border-error' : 'border-gray-200 focus:border-primary'
                }`}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
            </div>
            {errors.lastName && (
              <p id="lastName-error" className="mt-1.5 text-small text-error">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-body font-medium text-text mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.email ? 'border-error' : 'border-gray-200 focus:border-primary'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-small text-error">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-body font-medium text-text mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+254..."
                className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.phoneNumber ? 'border-error' : 'border-gray-200 focus:border-primary'
                }`}
                aria-invalid={!!errors.phoneNumber}
                aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
              />
            </div>
            {errors.phoneNumber && (
              <p id="phoneNumber-error" className="mt-1.5 text-small text-error">
                {errors.phoneNumber}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-body font-semibold text-text mb-4">Change Password (Optional)</h3>
          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-body font-medium text-text mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.currentPassword ? 'border-error' : 'border-gray-200 focus:border-primary'
                  }`}
                  aria-invalid={!!errors.currentPassword}
                  aria-describedby={errors.currentPassword ? 'currentPassword-error' : undefined}
                />
              </div>
              {errors.currentPassword && (
                <p id="currentPassword-error" className="mt-1.5 text-small text-error">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-body font-medium text-text mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.newPassword ? 'border-error' : 'border-gray-200 focus:border-primary'
                  }`}
                  aria-invalid={!!errors.newPassword}
                  aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
                />
              </div>
              {errors.newPassword && (
                <p id="newPassword-error" className="mt-1.5 text-small text-error">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-body font-medium text-text mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.confirmPassword ? 'border-error' : 'border-gray-200 focus:border-primary'
                  }`}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1.5 text-small text-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
