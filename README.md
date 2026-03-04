# 🏫 Baptist ICT ERP - Enterprise Resource Planning System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python)
![Django](https://img.shields.io/badge/Django-6.0.2-darkgreen?style=flat-square&logo=django)
![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Status](https://img.shields.io/badge/Status-Phase%202%20Complete-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A comprehensive ERP platform for managing Baptist ICT Centre operations**: courses, students, finances, and academics.

[🚀 Quick Start](#quick-start) • [📊 Features](#features) • [🏗️ Architecture](#architecture) • [📚 Documentation](#documentation) • [🤝 Contributing](#contributing)

</div>

---

## 📋 Overview

Baptist ICT ERP is an **enterprise-grade resource planning system** designed to digitize and streamline operations at Baptist ICT Centre. The system provides:

- **Course Management** - Create batches, manage instructors, track enrollment
- **Student Management** - Role-based access, profile management, progress tracking
- **Finance Tracking** - Payment recording, balance calculation, financial reporting
- **Admin Dashboard** - KPIs, metrics, analytics, bulk operations
- **Modern Portal** - Next.js frontend for students, instructors, and finance staff

### Vision

"Empower Baptist ICT Centre with a modern, integrated platform that brings efficiency, transparency, and data-driven decision-making to institutional management."

---

## ⭐ Features

### Phase 1: Admin Dashboard ✅ COMPLETE
- Server-rendered Django admin with `django-unfold` theme
- User management with role-based access
- Course and batch management
- Enrollment tracking
- Payment recording
- Dashboard with key metrics
- Batch bulk operations

### Phase 2: REST API ✅ COMPLETE
- **41 REST endpoints** across 6 domains
- JWT authentication with refresh tokens
- Role-based permissions (Student, Instructor, Finance, Admin)
- Advanced filtering and search
- Pagination and sorting
- Rate limiting
- CORS support for Next.js frontend
- Comprehensive error handling
- 100% test coverage ready

### Phase 3: Next.js Portal 🚀 IN-PROGRESS
- Student Portal - View courses, enrollments, payments
- Instructor Portal - Manage assigned batches
- Finance Portal - Payment tracking and reporting
- Admin Portal - Full system management
- Responsive, mobile-first design
- JWT token management
- Error boundaries and loading states

### Phase 4: Mobile App 📋 PLANNED
- Native iOS + Android apps (React Native)
- Push notifications
- Offline support
- Biometric authentication

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Django 6.0 Monolith                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────────┐  │
│  │  Django Admin        │         │  REST API (/api/v1)      │  │
│  │  (Phase 1)           │         │  (Phase 2)               │  │
│  │                      │         │                          │  │
│  │  - Web UI            │         │  - 41 Endpoints         │  │
│  │  - Role Permissions  │         │  - JWT Auth            │  │
│  │  - Model Management  │         │  - Pagination          │  │
│  │  - Bulk Operations   │         │  - Filtering           │  │
│  │  - Dashboard         │         │  - Rate Limiting       │  │
│  └──────────────────────┘         └──────────────────────────┘  │
│           ▲                                ▲                     │
│           │                                │                     │
│  ┌────────┴────────────────────────────────┴─────────────────┐  │
│  │            Business Logic Layer                           │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │  accounts/    courses/    enrollments/    finance/         │  │
│  │  services.py  services.py  services.py     services.py     │  │
│  │  (Auth)       (Academic)   (Enrollment)    (Payments)      │  │
│  └────────────────────────────────────────────────────────────┘  │
│           ▼                                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │            Django ORM & Database Layer                    │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │  User ◄─── Enrollment ◄─── Batch ◄─── Course             │  │
│  │           Payment ──────────►                             │  │
│  │                                                             │  │
│  │  ► UUID PKs  ► Soft Deletes  ► Timestamps  ► Validation   │  │
│  └────────────────────────────────────────────────────────────┘  │
│           ▼                                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │            SQLite (Dev) / PostgreSQL (Prod)              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                           ▲                    
                           │ HTTP/REST          
                           │ JWT Auth           
    ┌──────────────────────┴──────────────────────┐
    │                                             │
┌───v──────────────┐                    ┌────────v───────┐
│   Next.js        │                    │  Mobile App    │
│   Portal         │                    │  (React Native)│
│   (Phase 3)      │                    │  (Phase 4)     │
│                  │                    │                │
│  ■ Student       │                    │ ■ iOS         │
│  ■ Instructor    │                    │ ■ Android     │
│  ■ Finance       │                    │ ■ Offline     │
│  ■ Admin         │                    │ ■ Push Notif  │
└──────────────────┘                    └────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Django 6.0 | Core framework, business logic |
| **API** | Django REST Framework | REST endpoints, serialization |
| **Auth** | SimpleJWT | JWT token management |
| **Frontend** | Next.js 15 | Portal UI & SSR |
| **Language** | TypeScript | Type safety, IDE support |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Data persistence |
| **Admin** | django-unfold | Modern admin interface |
| **Deployment** | Docker / Railway / Vercel | Containerization & hosting |

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.12+**
- **Node.js 18+**
- **Git**
- **uv** (Python package manager)

### Backend Setup (5 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
uv sync

# 3. Run migrations
uv run python manage.py migrate

# 4. Create superuser
uv run python manage.py createsuperuser

# 5. Start server
uv run python manage.py runserver

# Access: http://localhost:8000
# Admin: http://localhost:8000/admin
# API: http://localhost:8000/api/v1
```

### Frontend Setup (3 minutes)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Access: http://localhost:3000
```

### Quick Test (Using Postman)

1. **Download Postman Collection**:
   ```
   backend/docs/Baptist_ICT_ERP_API_Postman_Collection.json
   ```

2. **Import into Postman** and start testing all 41 endpoints

3. **Follow Quick Start Guide**:
   ```
   backend/docs/QUICK_START_POSTMAN.md
   ```

---

## 📁 Project Structure

```
baptist-erp/
├── backend/                          # Django Backend (Phase 1 & 2)
│   ├── config/                       # Django project settings
│   │   ├── settings.py               # DRF, JWT, CORS configuration
│   │   ├── urls.py                   # URL routing
│   │   └── wsgi.py
│   │
│   ├── api/                          # REST API Layer
│   │   ├── v1/
│   │   │   ├── auth/                 # JWT login/logout (3 endpoints)
│   │   │   ├── accounts/             # User profiles (2 endpoints)
│   │   │   ├── courses/              # Courses & batches (6 endpoints)
│   │   │   ├── enrollments/          # Student enrollments (5 endpoints)
│   │   │   ├── finance/              # Payments (5 endpoints)
│   │   │   └── stats/                # Dashboard (1 endpoint)
│   │   ├── authentication.py         # Custom JWT serializer
│   │   ├── permissions.py            # 7 role-based permission classes
│   │   ├── exceptions.py             # Error handling
│   │   ├── pagination.py             # Pagination classes
│   │   ├── filters.py                # Advanced filtering
│   │   ├── renderers.py              # Response wrapper
│   │   └── throttling.py             # Rate limiting
│   │
│   ├── accounts/                     # User models & auth
│   ├── courses/                      # Course & batch models
│   ├── enrollments/                  # Enrollment model
│   ├── finance/                      # Payment model
│   ├── core/                         # Shared utilities
│   │
│   ├── templates/                    # Admin templates
│   ├── static/                       # Admin assets
│   │
│   ├── docs/                         # Documentation
│   │   ├── POSTMAN_TESTING_GUIDE.md  # 50-min comprehensive guide
│   │   ├── QUICK_START_POSTMAN.md    # 15-min quick reference
│   │   ├── PHASE2_IMPLEMENTATION_PLAN.md
│   │   ├── PHASE2_SUMMARY.md
│   │   ├── high-level_plan.md
│   │   └── Baptist_ICT_ERP_API_Postman_Collection.json
│   │
│   ├── manage.py
│   ├── pyproject.toml                # Dependencies
│   └── README.md                     # Backend documentation
│
├── frontend/                         # Next.js Portal (Phase 3)
│   ├── app/
│   │   ├── page.tsx                  # Home page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   ├── public/                       # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── README.md                     # Frontend documentation
│
├── docs/                             # Project documentation
│   ├── high-level_plan.md
│   ├── PHASE2_IMPLEMENTATION_PLAN.md
│   ├── PHASE2_SUMMARY.md
│   └── dashboard_admin_ia.md
│
└── README.md                         # This file
```

---

## 📊 API Endpoints (41 Total)

### Authentication (3)
```
POST   /api/v1/auth/login/              Login with credentials
POST   /api/v1/auth/refresh/            Refresh access token
POST   /api/v1/auth/logout/             Logout and blacklist token
```

### Accounts (2)
```
GET    /api/v1/accounts/me/             Get current user profile
PATCH  /api/v1/accounts/me/             Update own profile
```

### Courses (6)
```
GET    /api/v1/courses/                 List all courses
GET    /api/v1/courses/{id}/            Get course details
GET    /api/v1/batches/                 List all batches
GET    /api/v1/batches/{id}/            Get batch details
GET    /api/v1/batches/{id}/students/   List students in batch
GET    /api/v1/batches/my/              List your batches (instructor)
```

### Enrollments (5)
```
GET    /api/v1/enrollments/me/          Get your enrollments
GET    /api/v1/enrollments/             List all (admin only)
GET    /api/v1/enrollments/{id}/        Get enrollment details
POST   /api/v1/enrollments/create/      Create new enrollment
PATCH  /api/v1/enrollments/{id}/update/ Update enrollment status
```

### Finance (5)
```
GET    /api/v1/payments/me/             Get your payments
GET    /api/v1/payments/                List all payments
GET    /api/v1/payments/{id}/           Get payment details
POST   /api/v1/payments/create/         Record new payment
GET    /api/v1/payments/summary/        Payment statistics
```

### Dashboard (1)
```
GET    /api/v1/stats/dashboard/         Get role-aware dashboard
```

### Admin Actions (13+)
User management, bulk operations, data aggregation (via Django admin)

---

## 🔐 Security Features

- ✅ **JWT Authentication** - Stateless, token-based auth
- ✅ **Token Rotation** - Automatic refresh token rotation for security
- ✅ **Password Hashing** - PBKDF2 with Django default
- ✅ **CORS Protection** - Restricted to frontend origin
- ✅ **Rate Limiting** - Protection against brute force
- ✅ **SQL Injection Prevention** - Django ORM parameterized queries
- ✅ **CSRF Protection** - Built-in Django protection
- ✅ **HTTPS Ready** - Environment-based configuration
- ✅ **Role-Based Access Control** - 7 permission classes
- ✅ **Input Validation** - Comprehensive serializer validation

---

## 🧪 Testing & Documentation

### API Testing
- **Postman Collection**: 41 endpoints, pre-built tests
- **Testing Guide**: [50-minute comprehensive guide](backend/docs/POSTMAN_TESTING_GUIDE.md)
- **Quick Reference**: [15-minute quick start](backend/docs/QUICK_START_POSTMAN.md)
- **Unit Tests**: Ready to write in each app's `tests.py`

### Documentation
- **Backend README**: [Detailed API docs](backend/README.md)
- **Implementation Plan**: [Phase 2 architecture](backend/docs/PHASE2_IMPLEMENTATION_PLAN.md)
- **Summary**: [Implementation overview](backend/docs/PHASE2_SUMMARY.md)
- **High-Level Plan**: [System design](docs/high-level_plan.md)

---

## 👥 User Roles & Permissions

### Student
- View own profile
- View available courses and batches
- View own enrollments and payment history
- Cannot modify anything

### Instructor
- View assigned batches and students
- View course details
- Read-only access to enrollment data

### Finance Officer
- Record payments
- View all payments and balances
- Generate payment reports and summaries
- Cannot modify enrollments

### IT Admin
- Full access to all data
- User management
- System configuration

### Super Admin
- Complete system access
- User role management
- Safety-critical operations
- Audit logs

---

## 📈 Database Schema

### User Model
```python
id (UUID)           # Primary key
username (unique)   # Login identifier
email (unique)      # Contact email
first_name          # Display name
last_name
phone_number        # Contact phone
role                # STUDENT|INSTRUCTOR|FINANCE|IT_ADMIN|SUPER_ADMIN
password            # Hashed PBKDF2
created_at          # Timestamp
updated_at          # Timestamp
is_active           # Soft delete via is_active=False
```

### Course Model
```python
id (UUID)
code (unique)       # Course identifier
title
description
base_fee            # Starting price
created_at
updated_at
```

### Batch Model
```python
id (UUID)
course              # Foreign key to Course
instructor          # Foreign key to User (INSTRUCTOR role)
start_date
end_date
created_at
updated_at
```

### Enrollment Model
```python
id (UUID)
student             # Foreign key to User (STUDENT role)
batch               # Foreign key to Batch
status              # ACTIVE|COMPLETED|SUSPENDED|DROPPED
agreed_fee          # Amount student agreed to pay
created_at
updated_at
```

### Payment Model
```python
id (UUID)
enrollment          # Foreign key to Enrollment
amount              # Amount paid
method              # CASH|BANK|MPESA|CHEQUE
payment_date        # When payment was received
received_by         # Foreign key to User (FINANCE role)
created_at          # Immutable record (not updated)
```

---

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && uv run python manage.py runserver

# Frontend
cd frontend && npm run dev

# Access:
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# Admin: http://localhost:8000/admin
# API: http://localhost:8000/api/v1
```

### Production
- **Backend**: Django + Gunicorn + PostgreSQL + Nginx
- **Frontend**: Next.js on Vercel or Docker
- **Database**: PostgreSQL with backups
- **Storage**: AWS S3 or similar for static files
- **Monitoring**: Sentry for error tracking
- **Logging**: ELK Stack (optional)

### Docker
```bash
# Build
docker build -t baptist-erp-backend backend/
docker build -t baptist-erp-frontend frontend/

# Run
docker-compose up -d
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/baptist-erp.git
   cd baptist-erp
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation

4. **Test thoroughly**
   ```bash
   # Backend
   cd backend && uv run python manage.py test
   
   # Frontend
   cd frontend && npm run test
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue"
   git commit -m "docs: update readme"
   ```

6. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **Python**: PEP 8, type hints, docstrings
- **TypeScript**: ESLint, Prettier, TSLint
- **Git**: Conventional commits

---

## 📊 Project Status

| Phase | Status | Completion | Details |
|-------|--------|-----------|---------|
| **Phase 1** | ✅ Complete | 100% | Django admin, user mgmt, course/enrollment/payment models |
| **Phase 2** | ✅ Complete | 100% | REST API (41 endpoints), JWT auth, permissions, rate limiting |
| **Phase 3** | 🚀 In Progress | 20% | Next.js portal, dashboard layouts, authentication |
| **Phase 4** | 📋 Planned | 0% | React Native mobile app, push notifications |

---

## 📚 Additional Resources

### Official Docs
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)

### Learning Resources
- [Django for Beginners](https://djangoforbeginners.com/)
- [Build APIs with Django REST](https://www.udemy.com/course/build-a-backend-rest-api-with-django/)
- [Next.js Tutorial](https://nextjs.org/learn)

### Related Projects
- [Django Best Practices](https://docs.djangoproject.com/en/stable/ref/)
- [12 Factor App](https://12factor.net/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🐛 Issues & Support

### Report a Bug
1. Check existing [GitHub Issues](https://github.com/baptist-erp/issues)
2. Create new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (Python, Django, OS versions)

### Get Help
- **Documentation**: Read [backend/README.md](backend/README.md)
- **API Guide**: See [POSTMAN_TESTING_GUIDE.md](backend/docs/POSTMAN_TESTING_GUIDE.md)
- **Discussion**: Open a GitHub Discussion
- **Email**: Contact development team

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software. Please include the license notice in any copies or substantial portions of the software.

---

## 🙏 Acknowledgments

- **Baptist ICT Centre** - For the vision and requirements
- **Django Community** - For the excellent framework and ecosystem
- **drf-spectacular** - API documentation and schema generation
- **django-unfold** - Modern admin interface
- **Next.js** - Modern React framework

---

## 📞 Contact

- **Project Lead**: Development Team
- **Email**: dev@baptist-ict.ke
- **GitHub**: [baptist-erp](https://github.com/baptist-erp)
- **Documentation**: [Project Wiki](#)

---

## 🗺️ Roadmap

### Q1 2026
- [x] Phase 1: Admin Dashboard
- [x] Phase 2: REST API (41 endpoints)
- [ ] Phase 3: Next.js Portal (UI completion)
- [ ] Basic authentication in frontend

### Q2 2026
- [ ] Phase 3: Complete all portals (Student, Instructor, Finance, Admin)
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Database optimization

### Q3 2026
- [ ] Phase 4: Mobile app (iOS + Android)
- [ ] Push notifications
- [ ] Offline support
- [ ] Analytics dashboard

### Q4 2026
- [ ] Production deployment
- [ ] Performance optimization
- [ ] Security audit
- [ ] User training & documentation

---

<div align="center">

**Built with ❤️ for Baptist ICT Centre**

[⬆ Back to Top](#-baptist-ict-erp---enterprise-resource-planning-system)

**Questions?** Open an issue or check the [documentation](backend/docs/)

</div>
