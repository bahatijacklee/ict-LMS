# Baptist ICT ERP - Frontend

A modern, responsive web application for managing educational institutions built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## 📋 Overview

The Baptist ICT ERP frontend provides comprehensive management interfaces for educational institutions with role-based dashboards for administrators, instructors, students, finance officers, and registrars.

### Key Features

- 🎨 **Polished Landing Page** - Animated hero section, feature showcases, and conversion-optimized content
- 🔐 **Authentication System** - Secure login/logout with JWT token management
- 📊 **Role-Based Dashboards** - Tailored interfaces for 5 user roles
- 👨‍🏫 **Instructor Portal** - Course management, attendance tracking, grade submission
- 💰 **Finance Management** - Payment processing, fee tracking, financial reporting
- 📚 **Course Management** - Program creation, enrollment tracking, scheduling
- 📈 **Real-Time Analytics** - Interactive charts and statistics
- ♿ **Accessible Design** - WCAG compliant with keyboard navigation and reduced motion support
- 📱 **Responsive UI** - Optimized for desktop, tablet, and mobile devices

## 🚀 Tech Stack

- **Framework**: [Next.js 16.1.6](https://nextjs.org) with App Router and Turbopack
- **UI Library**: [React 19](https://react.dev) with TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with custom animations
- **Components**: [shadcn/ui](https://ui.shadcn.com) components
- **Icons**: [Lucide React](https://lucide.dev)
- **HTTP Client**: Native Fetch API with custom wrapper
- **State Management**: React hooks (useState, useEffect, useContext)
- **Forms**: Custom form handling with validation
- **Charts**: Recharts for data visualization

## 📦 Prerequisites

- Node.js 18+ or later
- npm, yarn, pnpm, or bun
- Baptist ICT ERP Backend API running (default: `http://localhost:8000`)

## 🛠️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd baptist-erp/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Ensure backend is running**:
   The Django backend should be running on `http://localhost:8000`. See `../backend/README.md` for setup instructions.

## 🏃‍♂️ Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**Available Scripts:**
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes (login, logout)
│   ├── (dashboards)/        # Protected dashboard routes
│   │   ├── admin/           # Administrator dashboard
│   │   ├── instructor/      # Instructor portal
│   │   ├── student/         # Student dashboard
│   │   ├── finance/         # Finance officer dashboard
│   │   └── registrar/       # Registrar dashboard
│   ├── globals.css          # Global styles & animations
│   ├── layout.tsx           # Root layout component
│   ├── middleware.ts        # Route protection middleware
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── features/            # Feature-specific components
│   ├── layouts/             # Layout components (Sidebar, Header, etc.)
│   └── shared/              # Shared/reusable components
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts           # Authentication hook
│   ├── useCourses.ts        # Course data hook
│   ├── useEnrollments.ts    # Enrollment data hook
│   ├── usePayments.ts       # Payment data hook
│   ├── useAttendance.ts     # Attendance tracking hook
│   └── useInstructor.ts     # Instructor-specific data hook
├── lib/                     # Utility libraries
│   ├── api.ts               # API client wrapper
│   ├── auth.ts              # Authentication utilities
│   ├── constants.ts         # Application constants
│   └── utils.ts             # Shared utilities
├── types/                   # TypeScript type definitions
│   └── index.ts             # Shared types and interfaces
├── public/                  # Static assets
│   └── images/              # Images and SVG illustrations
└── components.json          # shadcn/ui configuration
```

## 🔑 Authentication

The application uses JWT-based authentication:

1. **Login**: POST to `/api/v1/auth/login/` with credentials
2. **Token Storage**: Access and refresh tokens stored in `localStorage`
3. **Auto-Refresh**: Tokens automatically refreshed before expiration
4. **Protected Routes**: Middleware redirects unauthenticated users to login
5. **Logout**: Clears tokens and redirects to landing page

## 🎨 Styling & Animations

- **Tailwind CSS v4** with custom design tokens via `@theme inline`
- **Custom Animations**:
  - `animate-enter-up` - Entrance reveal from bottom
  - `animate-enter-scale` - Scale and fade entrance
  - `animate-float-soft` - Gentle floating motion
  - `feature-card` - Interactive hover depth effects
  - `cta-button-shine` - Button shine sweep animation
  - `hero-gradient-shift` - Animated gradient text
  - `badge-glow` - Pulsing glow effect
- **Accessibility**: All animations respect `prefers-reduced-motion`

## 🧩 Key Components

### Dashboards
- **AdminDashboard** - System overview, user management, analytics
- **InstructorDashboard** - Course list, attendance, grade submissions
- **StudentDashboard** - Enrolled courses, grades, schedule
- **FinanceDashboard** - Payment tracking, fee management
- **RegistrarDashboard** - Student records, enrollment management

### Layouts
- **DashboardLayout** - Sidebar navigation, header, role-based menus
- **AuthLayout** - Centered layout for login/register pages

### Features
- **PaymentModal** - Payment processing interface
- **CourseEnrollmentModal** - Course registration flow
- **AttendanceTracker** - Real-time attendance marking
- **GradeSubmission** - Grade entry and submission

## 🔌 API Integration

API calls are centralized in `lib/api.ts`:

```typescript
import { apiClient } from '@/lib/api';

// GET request
const courses = await apiClient.get('/api/v1/courses/courses/');

// POST request
const enrollment = await apiClient.post('/api/v1/enrollments/enrollments/', {
  student: studentId,
  course: courseId,
});
```

**Authentication**: Access tokens automatically attached to requests via interceptor.

## 🧪 Testing

```bash
# Run all tests (when configured)
npm test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e
```

## 🏗️ Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

**Production Checklist:**
- [ ] Set `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Configure caching headers for static assets
- [ ] Enable compression (gzip/brotli)
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure analytics (Google Analytics, Plausible, etc.)
- [ ] Test all user flows in production-like environment

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: 1024px - 1280px
- **Large Desktop**: > 1280px

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### CSS Not Loading
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
- Verify backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is enabled in Django backend

## 📚 Documentation

Additional documentation available in `/docs`:
- `PHASE2_API_GUIDE.md` - Backend API reference
- `FRONTEND_UI_UX_PLAN.md` - UI/UX design specifications
- `nextjs_app_plan.md` - Application architecture
- `POSTMAN_TESTING_GUIDE.md` - API testing guide

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Open Pull Request

## 📄 License

[Add your license here]

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
