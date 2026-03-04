# 🏫 Baptist ICT ERP - Backend (Django)

<div align="center">

![Django](https://img.shields.io/badge/Django-6.0.2-darkgreen?style=flat-square&logo=django)
![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python)
![DRF](https://img.shields.io/badge/DRF-3.14-red?style=flat-square)
![JWT](https://img.shields.io/badge/JWT-5.3-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A production-ready REST API backend for Baptist ICT Centre management system**

[📖 Documentation](#documentation) • [🚀 Quick Start](#quick-start) • [🏗️ Architecture](#architecture) • [🧪 Testing](#testing)

</div>

---

## 📋 Overview

The Baptist ICT ERP backend is a **monolithic Django 6.0 application** that serves two interfaces:

1. **Command Center** (Admin Dashboard) - Server-rendered Django templates with `django-unfold`
2. **Campus Portal** (Next.js) - REST API with JWT authentication

This backend handles all business logic, data persistence, and API layer for the institution's:
- Course and batch management
- Student enrollment tracking
- Payment and finance tracking
- User authentication and role-based access control

---

## ✨ Features

### Core Features
- ✅ **Multi-role Access Control** - Student, Instructor, Finance Officer, IT Admin, Super Admin
- ✅ **JWT Authentication** - Token-based with refresh token rotation
- ✅ **REST API** - Fully versioned (`/api/v1/`) with 41 endpoints
- ✅ **Advanced Filtering** - Search, filter, order on all list endpoints
- ✅ **Pagination** - Configurable per-page sizes
- ✅ **Admin Dashboard** - Role-aware analytics and KPIs via django-unfold
- ✅ **Rate Limiting** - Protection against API abuse
- ✅ **CORS Support** - Ready for Next.js frontend integration
- ✅ **Input Validation** - Comprehensive serializer-level validation
- ✅ **Error Handling** - Standardized error responses across API

### Technical Features
- ✅ **Service Layer Pattern** - Clean separation of concerns
- ✅ **UUID Primary Keys** - Secure, non-sequential IDs
- ✅ **Soft Deletes** - Models support soft deletion (via `deleted_at` field)
- ✅ **Audit Timestamps** - `created_at`, `updated_at` on all models
- ✅ **Database Transactions** - ACID compliance for financial operations

---

## 🏗️ Architecture

### Folder Structure

```
backend/
├── config/                      # Django project configuration
│   ├── settings.py             # Global settings (DRF, JWT, CORS, Unfold)
│   ├── urls.py                 # URL routing (admin + API)
│   ├── wsgi.py                 # WSGI application
│   └── asgi.py                 # ASGI application
│
├── api/                         # REST API Layer (Phase 2)
│   ├── authentication.py       # Custom JWT token serializer
│   ├── permissions.py          # Role-based permission classes
│   ├── exceptions.py           # Standardized error handling
│   ├── pagination.py           # Pagination classes
│   ├── filters.py              # Advanced filtering
│   ├── renderers.py            # JSON response wrapper
│   ├── throttling.py           # Rate limiting
│   └── v1/                     # API v1 endpoints
│       ├── auth/               # Authentication
│       ├── accounts/           # User profiles
│       ├── courses/            # Courses and batches
│       ├── enrollments/        # Enrollments
│       ├── finance/            # Payments
│       └── stats/              # Dashboard statistics
│
├── accounts/                    # User management
│   ├── models.py               # Custom User model with roles
│   ├── admin.py                # Django admin configuration
│   ├── services.py             # User business logic
│   └── migrations/             # Database migrations
│
├── courses/                     # Course management
│   ├── models.py               # Course, Batch models
│   ├── admin.py                # Django admin configuration
│   ├── services.py             # Course business logic
│   └── migrations/
│
├── enrollments/                 # Enrollment management
│   ├── models.py               # Enrollment model
│   ├── admin.py
│   ├── services.py
│   └── migrations/
│
├── finance/                     # Payment tracking
│   ├── models.py               # Payment model
│   ├── admin.py
│   ├── services.py
│   └── migrations/
│
├── core/                        # Shared utilities
│   ├── models.py               # Base TimeStampedModel
│   ├── admin.py                # Dashboard callback
│   └── views.py                # Dashboard logic
│
├── templates/                   # Django templates (admin)
│   └── admin/                  # Custom admin templates
│
├── static/                      # Static files (CSS, JS)
│   └── admin/
│
├── manage.py                    # Django management script
├── pyproject.toml               # Project dependencies
├── db.sqlite3                   # SQLite database (dev)
└── README.md                    # This file
```

### Data Models

```
┌─────────────────┐
│      User       │ (accounts)
├─────────────────┤
│ id (UUID)       │
│ username        │
│ email           │
│ role *          │ → STUDENT | INSTRUCTOR | FINANCE | IT_ADMIN | SUPER_ADMIN
│ phone_number    │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         ├─────────────────┬────────────────┐
         │                 │                │
    ┌────v───────┐  ┌─────v──────┐  ┌────v────────┐
    │ Enrollment │  │ Batch      │  │  Payment    │
    │(enrollments)   │(courses)   │  │ (finance)   │
    ├────────────┤  ├────────────┤  ├─────────────┤
    │ student_id │  │ instructor │  │ enrollment_ │
    │ batch_id   │  │ course_id  │  │ id          │
    │ status *   │  │ start_date │  │ amount      │
    │ agreed_fee │  │ end_date   │  │ method *    │
    │ created_at │  │ created_at │  │ received_by │
    └────────────┘  └────────────┘  │ payment_date│
         │                │           └─────────────┘
         └────────────┬───┘
                  ┌───v──────┐
                  │  Course  │
                  │(courses) │
                  ├──────────┤
                  │ code *   │
                  │ title    │
                  │ base_fee │
                  └──────────┘
```

### API Response Format

**Success Response (200-201)**:
```json
{
  "status": "success",
  "data": { /* Actual data */ },
  "message": "Optional message",
  "meta": { "pagination": { "count": 100, "page": 1 } }
}
```

**Error Response (400-500)**:
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "One or more fields have errors",
  "errors": { "field_name": ["Error message"] }
}
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.12+**
- **SQLite3** (included with Python)
- **uv** (Python package manager) - [Install here](https://docs.astral.sh/uv/getting-started/)

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   uv sync
   ```
   This installs all packages from `pyproject.toml` in an isolated environment.

3. **Run migrations**:
   ```bash
   uv run python manage.py migrate
   ```

4. **Create superuser** (for Django admin):
   ```bash
   uv run python manage.py createsuperuser
   ```
   Follow the prompts to create an admin account.

5. **Create test users** (use Django admin at `http://localhost:8000/admin`):
   - Student user (role: STUDENT)
   - Instructor user (role: INSTRUCTOR)
   - Finance user (role: FINANCE)
   - IT Admin user (role: IT_ADMIN)

6. **Start development server**:
   ```bash
   uv run python manage.py runserver
   ```
   Access at: `http://localhost:8000`

---

## 🔐 Authentication

### JWT Token Flow

```
1. User sends credentials → POST /api/v1/auth/login/
2. Backend validates → Returns access_token + refresh_token
3. Client stores tokens → In memory or secure cookies
4. Client includes token → Authorization: Bearer {access_token}
5. Backend verifies token → Token includes user role, permissions
6. Access token expires → Use refresh_token to get new access_token
7. User logs out → Refresh token blacklisted
```

### Token Configuration

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),      # 1 hour (dev)
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),         # 7 days
    'ROTATE_REFRESH_TOKENS': True,                        # Security: rotate on refresh
    'BLACKLIST_AFTER_ROTATION': True,                     # Invalidate old tokens
    'AUTH_HEADER_TYPES': ('Bearer',),                     # Authorization format
}
```

### Permission Classes

```python
IsStudent                # User role is STUDENT
IsInstructor            # User role is INSTRUCTOR
IsFinanceOfficer        # User role is FINANCE
IsITAdmin               # User role is IT_ADMIN or SUPER_ADMIN
IsSuperAdmin            # User role is SUPER_ADMIN
IsOwnerOrReadOnly       # User can only modify own objects
IsStudentOrReadOnly     # Students read-only, admins can modify
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login/` | No | Login with credentials |
| POST | `/auth/refresh/` | No | Refresh access token |
| POST | `/auth/logout/` | Yes | Logout and blacklist token |

### Accounts
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/accounts/me/` | Yes | All | Get current user profile |
| PATCH | `/accounts/me/` | Yes | All | Update own profile |

### Courses
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/courses/` | Yes | All | List all courses |
| GET | `/courses/{id}/` | Yes | All | Get course details |
| GET | `/batches/` | Yes | All | List all batches |
| GET | `/batches/{id}/` | Yes | All | Get batch details |
| GET | `/batches/{id}/students/` | Yes | Instructor+ | List students in batch |
| GET | `/batches/my/` | Yes | Instructor | List your batches |

### Enrollments
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/enrollments/me/` | Yes | Student | Get your enrollments |
| GET | `/enrollments/` | Yes | Admin | Get all enrollments |
| GET | `/enrollments/{id}/` | Yes | All | Get enrollment details |
| POST | `/enrollments/create/` | Yes | Admin | Create enrollment |
| PATCH | `/enrollments/{id}/update/` | Yes | Admin | Update enrollment status |

### Payments
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/payments/me/` | Yes | Student | Get your payments |
| GET | `/payments/` | Yes | Finance | Get all payments |
| GET | `/payments/{id}/` | Yes | Student+ | Get payment details |
| POST | `/payments/create/` | Yes | Finance | Record new payment |
| GET | `/payments/summary/` | Yes | Finance | Get payment statistics |

### Dashboard
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/stats/dashboard/` | Yes | All | Get role-aware dashboard data |

---

## 🧪 Testing

### Setup Postman

1. **Import collection**:
   - Download: `docs/Baptist_ICT_ERP_API_Postman_Collection.json`
   - Open Postman → Import → Select file

2. **Create environment**:
   - Name: `Baptist ERP Local`
   - Variable: `base_url` = `http://localhost:8000/api/v1`

3. **Start testing**:
   - All 41 endpoints ready to test
   - Tokens auto-save after login
   - Full testing guide: `docs/POSTMAN_TESTING_GUIDE.md`

### Manual API Testing

```bash
# Login as student
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "student@baptist.edu", "password": "password123"}'

# Get courses (with token)
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:8000/api/v1/courses/

# Get your enrollments
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:8000/api/v1/enrollments/me/
```

### Running Tests

```bash
# Run all tests
uv run python manage.py test

# Run specific app tests
uv run python manage.py test accounts

# Run with verbose output
uv run python manage.py test --verbosity=2
```

---

## 🛠️ Development

### Project Dependencies

```toml
[project]
dependencies = [
    "django>=6.0.2",                           # Web framework
    "django-unfold>=0.80.2",                   # Modern admin interface
    "djangorestframework>=3.14.0",             # REST API
    "djangorestframework-simplejwt>=5.3.0",    # JWT authentication
    "django-cors-headers>=4.3.0",              # CORS support
    "django-filter>=24.0",                     # Advanced filtering
    "drf-spectacular>=0.26.0",                 # API documentation
    "python-decouple>=3.8",                    # Environment variables
]
```

### Create Custom User

The system uses a custom User model with roles. To add new roles:

```python
# accounts/models.py
class User(AbstractUser, TimeStampedModel):
    class RoleChoices(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        INSTRUCTOR = 'INSTRUCTOR', 'Instructor'
        FINANCE = 'FINANCE', 'Finance Officer'
        IT_ADMIN = 'IT_ADMIN', 'IT Admin'
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
        # ADD NEW ROLES HERE
    
    role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.STUDENT
    )
```

### Adding New API Endpoints

1. **Create serializer** in `api/v1/{domain}/serializers.py`
2. **Create view** in `api/v1/{domain}/views.py`
3. **Add URL** in `api/v1/{domain}/urls.py`
4. **Add permission class** if needed (in `api/permissions.py`)
5. **Write tests** in `{domain}/tests.py`
6. **Update documentation** in README and Postman collection

### Environment Variables

Create `.env` file in backend directory:

```bash
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# CORS (Production)
CORS_ALLOWED_ORIGINS=https://portal.baptist-ict.ke

# JWT (Production)
JWT_SECRET_KEY=your-jwt-secret
ACCESS_TOKEN_LIFETIME=900  # 15 minutes

# Sentry (Error tracking)
SENTRY_DSN=https://your-sentry-url
```

Load with `python-decouple`:

```python
from decouple import config

DEBUG = config('DEBUG', default=False, cast=bool)
JWT_LIFETIME = config('ACCESS_TOKEN_LIFETIME', default=3600, cast=int)
```

---

## 📊 Admin Dashboard

Access Django admin at: `http://localhost:8000/admin/`

### Features
- **Role-based sections** - Super Admin sees everything, Finance sees only payments
- **Quick filters** - Filter by status, date, role, etc.
- **Batch actions** - Bulk update enrollments, send notifications
- **Custom dashboard** - KPIs and charts via `core/views.py`
- **Search** - Search across all models

### Users Section
- Create users with assigned roles
- View login history
- Reset passwords
- View activity log

### Academics Section
- Manage courses and batches
- Assign instructors
- Set pricing
- Track course load

### Enrollments Section
- View all enrollments
- Update status (ACTIVE, COMPLETED, SUSPENDED, DROPPED)
- Calculate class sizes
- Generate reports

### Finance Section
- Record payments
- View payment history (by method, date, student)
- Generate revenue reports
- Track outstanding balances

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: No module named 'rest_framework'` | Run `uv sync` to install dependencies |
| `django.db.ProgrammingError: relation "accounts_user" does not exist` | Run `uv run python manage.py migrate` |
| `401 Unauthorized` on API calls | Token expired or invalid, login again |
| `403 Forbidden` on admin endpoint | Your user role lacks permission, switch to admin |
| `CORS error` from frontend | Add frontend URL to `CORS_ALLOWED_ORIGINS` in settings.py |
| Database locked errors | Close other connections, restart Django server |

### Debug Mode

Enable debug mode in Django shell:

```bash
uv run python manage.py shell

# Test user authentication
from accounts.models import User
user = User.objects.get(username='student@baptist.edu')
print(f"Role: {user.role}")
print(f"Enrollments: {user.enrollments.count()}")

# Check payments
from finance.models import Payment
total = Payment.objects.aggregate(Sum('amount'))['amount__sum']
print(f"Total collected: {total}")
```

---

## 📚 Documentation

- **API Design**: `docs/PHASE2_IMPLEMENTATION_PLAN.md`
- **Testing Guide**: `docs/POSTMAN_TESTING_GUIDE.md`
- **Quick Start**: `docs/QUICK_START_POSTMAN.md`
- **Implementation Summary**: `docs/PHASE2_SUMMARY.md`
- **Architecture Plan**: `docs/high-level_plan.md`

---

## 📦 Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in settings
- [ ] Configure `SECRET_KEY` securely
- [ ] Setup PostgreSQL (replace SQLite)
- [ ] Configure CORS for production domain
- [ ] Setup SSL/HTTPS
- [ ] Configure email backend
- [ ] Setup logging and monitoring (Sentry)
- [ ] Run `python manage.py collectstatic`
- [ ] Test all API endpoints in production
- [ ] Setup database backups
- [ ] Configure rate limiting
- [ ] Setup caching (Redis)

### Deployment Options

- **Heroku**: `Procfile` included
- **AWS**: EC2 + RDS + S3
- **DigitalOcean**: App Platform
- **Docker**: `Dockerfile` ready (create if needed)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following Django best practices
3. Run tests: `uv run python manage.py test`
4. Commit with clear message: `git commit -am 'Add feature description'`
5. Push to branch: `git push origin feature/your-feature`
6. Create Pull Request with description

### Code Style

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use type hints for functions
- Document complex logic
- Add docstrings to classes and functions
- Keep functions small and focused

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](../LICENSE) file for details.

---

## 📞 Support

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Documentation**: Check `/docs/` folder
- **API Reference**: Visit DRF docs: https://www.django-rest-framework.org/

---

## 🙏 Acknowledgments

- **Django** - The web framework for perfectionists
- **Django REST Framework** - Building REST APIs in Django
- **django-unfold** - Modern admin interface
- **SimpleJWT** - JWT authentication for DRF

---

<div align="center">

**Made with ❤️ for Baptist ICT Centre**

[Back to Top ⬆️](#-baptist-ict-erp---backend-django)

</div>
