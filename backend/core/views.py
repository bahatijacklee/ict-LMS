from django.urls import reverse

from accounts.models import User
from enrollments.services import (
    get_enrollment_dashboard_stats,
    get_recent_enrollments,
)
from finance.services import get_finance_dashboard_stats, get_recent_payments


def _get_role_flags(user: User) -> dict:
    """
    Derive high-level role flags from both the custom `role` field
    and Django auth groups, so we can drive UI decisions consistently.
    """
    group_names = set(user.groups.values_list("name", flat=True))
    role = getattr(user, "role", None)

    is_super_admin = user.is_superuser or role == User.RoleChoices.SUPER_ADMIN or "Super Admin" in group_names
    is_finance = role == User.RoleChoices.FINANCE or "Finance" in group_names
    is_it_admin = role == User.RoleChoices.IT_ADMIN or "IT Admin" in group_names
    is_registrar = "Registrar" in group_names or "Admissions" in group_names

    return {
        "is_super_admin": is_super_admin,
        "is_finance": is_finance,
        "is_it_admin": is_it_admin,
        "is_registrar": is_registrar,
    }


def _build_quick_actions(user: User) -> list[dict]:
    """
    Build a set of quick-action links for the current user.
    """
    actions: list[dict] = []
    flags = _get_role_flags(user)

    # All staff users get access to core shortcuts
    if user.is_staff:
        actions.append(
            {
                "label": "Add Enrollment",
                "description": "Register a new student into a batch.",
                "url": reverse("admin:enrollments_enrollment_add"),
            }
        )

    # Role-specific shortcuts
    if flags["is_it_admin"]:
        actions.extend(
            [
                {
                    "label": "Create Course",
                    "description": "Add a new course to the catalog.",
                    "url": reverse("admin:courses_course_add"),
                },
                {
                    "label": "Create Batch",
                    "description": "Schedule a new cohort for an existing course.",
                    "url": reverse("admin:courses_batch_add"),
                },
                {
                    "label": "Manage Users",
                    "description": "Create or update staff and student accounts.",
                    "url": reverse("admin:accounts_user_changelist"),
                },
            ]
        )

    if flags["is_finance"]:
        actions.extend(
            [
                {
                    "label": "Log Payment",
                    "description": "Record a tuition payment against an enrollment.",
                    "url": reverse("admin:finance_payment_add"),
                },
                {
                    "label": "View Enrollments",
                    "description": "Review all enrollments and balances.",
                    "url": reverse("admin:enrollments_enrollment_changelist"),
                },
            ]
        )

    if flags["is_super_admin"]:
        actions.append(
            {
                "label": "View Finance Reports",
                "description": "Review institution-wide payment and arrears data.",
                "url": reverse("admin:finance_payment_changelist"),
            }
        )

    return actions


def dashboard_callback(request, context: dict) -> dict:
    """
    Prepare custom variables for the Unfold-powered admin dashboard.
    This data is consumed in templates/admin/index.html.
    """
    user: User = request.user  # type: ignore[assignment]
    flags = _get_role_flags(user)

    enrollment_stats = get_enrollment_dashboard_stats()
    finance_stats = get_finance_dashboard_stats()

    # Base KPIs visible to all staff.
    kpis: list[dict] = [
        {
            "label": "Active enrollments",
            "value": enrollment_stats["active_enrollments"],
            "description": "Students currently active in a batch.",
        },
        {
            "label": "Total enrollments",
            "value": enrollment_stats["total_enrollments"],
            "description": "All historical enrollments in the system.",
        },
        {
            "label": "Active batches",
            "value": enrollment_stats["active_batches"],
            "description": "Teaching groups currently configured.",
        },
    ]

    # Finance-focused KPIs only for finance and super admins.
    if flags["is_finance"] or flags["is_super_admin"]:
        kpis.extend(
            [
                {
                    "label": "Payments today",
                    "value": finance_stats["payments_today"],
                    "description": "Total amount received today.",
                },
                {
                    "label": "Payments this month",
                    "value": finance_stats["payments_this_month"],
                    "description": "Total amount received this month.",
                },
                {
                    "label": "Outstanding fees",
                    "value": finance_stats["outstanding_total"],
                    "description": "Sum of unpaid balances across all enrollments.",
                },
            ]
        )

    context.update(
        {
            "dashboard_kpis": kpis,
            "recent_enrollments": get_recent_enrollments(),
            "recent_payments": get_recent_payments(),
            "quick_actions": _build_quick_actions(user),
            "role_flags": flags,
        }
    )
    return context

