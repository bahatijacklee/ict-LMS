import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors: Institutional Blue + Warm Orange
      colors: {
        brand: '#0066CC',
        'brand-light': '#E6F0FF',
        'brand-dark': '#004099',
        accent: '#F97316',
        'accent-light': '#FEF3C7',
        success: '#10B981',
        'success-light': '#D1FAE5',
        warning: '#F59E0B',
        'warning-light': '#FEF3C7',
        error: '#EF4444',
        'error-light': '#FEE2E2',
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      backgroundColor: {
        'page': '#FAFAFA',
        'surface': '#FFFFFF',
      },
      // 8px grid spacing system
      spacing: {
        xs: '4px',
        sm: '8px',
        base: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2lg': '40px',
        '2xl': '48px',
        '3xl': '64px',
      },
      // Typography: Inter font
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      fontSize: {
        'label': ['12px', { lineHeight: '1.33', fontWeight: '500' }],
        'small': ['14px', { lineHeight: '1.43', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h2': ['24px', { lineHeight: '1.33', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.25', fontWeight: '700' }],
      },
      // Shadow hierarchy
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
        'focus': '0 0 0 3px rgba(0, 102, 204, 0.1), 0 0 0 3px rgba(0, 102, 204, 0.5)',
      },
      // Border radius
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Responsive container
      maxWidth: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [require('tailwindcss/plugin')],
};

export default config;
