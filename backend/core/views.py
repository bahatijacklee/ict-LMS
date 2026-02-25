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
    Build a set of quick-action links for the current user based on their role.
    """
    actions: list[dict] = []
    flags = _get_role_flags(user)

    # Registrar-specific actions
    if flags["is_registrar"]:
        actions.extend(
            [
                {
                    "label": "Add Enrollment",
                    "description": "Register a new student into a batch.",
                    "url": reverse("admin:enrollments_enrollment_add"),
                },
                {
                    "label": "Search Students",
                    "description": "Find and manage student enrollments.",
                    "url": reverse("admin:enrollments_enrollment_changelist"),
                },
            ]
        )
        return actions

    # Finance Officer-specific actions
    if flags["is_finance"]:
        actions.extend(
            [
                {
                    "label": "Log Payment",
                    "description": "Record a tuition payment against an enrollment.",
                    "url": reverse("admin:finance_payment_add"),
                },
                {
                    "label": "View Overdue Accounts",
                    "description": "See enrollments with outstanding balances.",
                    "url": reverse("admin:enrollments_enrollment_changelist"),
                },
            ]
        )
        return actions

    # IT Admin-specific actions
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
        return actions

    # Super Admin gets access to all actions
    if flags["is_super_admin"]:
        actions.extend(
            [
                {
                    "label": "View Finance Reports",
                    "description": "Review institution-wide payment and arrears data.",
                    "url": reverse("admin:finance_payment_changelist"),
                },
                {
                    "label": "View Enrollments",
                    "description": "Review all enrollments and student status.",
                    "url": reverse("admin:enrollments_enrollment_changelist"),
                },
            ]
        )

    return actions


def dashboard_callback(request, context: dict) -> dict:
    """
    Prepare custom variables for the Unfold-powered admin dashboard.
    This data is consumed in templates/admin/index.html.
    Personalizes KPIs, widgets, and quick actions by user role.
    """
    from enrollments.services import (
        get_new_enrollments_today,
        get_new_enrollments_this_week,
        get_active_enrollments_per_course,
        get_approaching_completion_enrollments,
    )
    from finance.services import get_top_debtors, get_revenue_by_course
    from courses.services import (
        get_active_courses_count,
        get_upcoming_batches,
        get_instructor_load,
    )
    from accounts.services import get_recently_created_staff
    
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

    # Finance Officer KPIs
    if flags["is_finance"]:
        kpis.clear()  # Finance officer gets finance-focused dashboard
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

    # Registrar KPIs
    elif flags["is_registrar"]:
        kpis.clear()  # Registrar gets registrar-focused dashboard
        kpis.extend(
            [
                {
                    "label": "New enrollments today",
                    "value": get_new_enrollments_today(),
                    "description": "Enrollments created today.",
                },
                {
                    "label": "New enrollments this week",
                    "value": get_new_enrollments_this_week(),
                    "description": "Enrollments created in the last 7 days.",
                },
                {
                    "label": "Active enrollments",
                    "value": enrollment_stats["active_enrollments"],
                    "description": "Students currently active in a batch.",
                },
            ]
        )

    # IT Admin KPIs
    elif flags["is_it_admin"]:
        kpis.clear()  # IT Admin gets IT-focused dashboard
        kpis.extend(
            [
                {
                    "label": "Active courses",
                    "value": get_active_courses_count(),
                    "description": "Courses with scheduled batches.",
                },
                {
                    "label": "Active batches",
                    "value": enrollment_stats["active_batches"],
                    "description": "Teaching groups currently configured.",
                },
                {
                    "label": "Total enrollments",
                    "value": enrollment_stats["total_enrollments"],
                    "description": "All enrollments across all batches.",
                },
            ]
        )

    # Super Admin KPIs (includes base + finance)
    elif flags["is_super_admin"]:
        kpis.extend(
            [
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
                {
                    "label": "Payments today",
                    "value": finance_stats["payments_today"],
                    "description": "Total amount received today.",
                },
            ]
        )

    # Prepare widgets based on role
    context_data = {
        "dashboard_kpis": kpis,
        "quick_actions": _build_quick_actions(user),
        "role_flags": flags,
    }

    # Widget content varies by role
    if flags["is_finance"]:
        # Finance Officer gets recent payments and top debtors
        context_data["recent_payments"] = get_recent_payments()
        context_data["top_debtors"] = get_top_debtors()
        context_data["widget_title"] = "Recent Payments"
        context_data["secondary_widget_title"] = "Top Debtors"
    elif flags["is_registrar"]:
        # Registrar gets recent and approaching-completion enrollments
        context_data["recent_enrollments"] = get_recent_enrollments()
        context_data["approaching_enrollments"] = get_approaching_completion_enrollments()
        context_data["widget_title"] = "Recent Enrollments"
        context_data["secondary_widget_title"] = "Approaching Completion"
    elif flags["is_it_admin"]:
        # IT Admin gets upcoming batches and recently created staff
        context_data["upcoming_batches"] = get_upcoming_batches()
        context_data["recent_staff"] = get_recently_created_staff()
        context_data["instructor_load"] = get_instructor_load()
        context_data["widget_title"] = "Upcoming Batches"
        context_data["secondary_widget_title"] = "Recently Created Staff"
    elif flags["is_super_admin"]:
        # Super Admin gets finance overview with revenue breakdown
        context_data["recent_payments"] = get_recent_payments()
        context_data["revenue_by_course"] = get_revenue_by_course()
        context_data["widget_title"] = "Recent Payments"
        context_data["secondary_widget_title"] = "Revenue by Course"
    else:
        # Default for other staff without specific role
        context_data["recent_enrollments"] = get_recent_enrollments()
        context_data["recent_payments"] = get_recent_payments()
        context_data["widget_title"] = "Recent Enrollments"
        context_data["secondary_widget_title"] = "Recent Payments"

    context.update(context_data)
    return context

