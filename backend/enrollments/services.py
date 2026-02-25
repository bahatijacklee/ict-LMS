from datetime import timedelta
from django.db.models import Count, DecimalField, ExpressionWrapper, F, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone

from .models import Enrollment
from courses.models import Batch


def get_enrollment_dashboard_stats() -> dict:
    """
    Lightweight aggregate statistics used on the admin dashboard.
    """
    total_enrollments = Enrollment.objects.count()
    active_enrollments = Enrollment.objects.filter(
        status=Enrollment.StatusChoices.ACTIVE
    ).count()
    active_batches = Batch.objects.count()

    return {
        "total_enrollments": total_enrollments,
        "active_enrollments": active_enrollments,
        "active_batches": active_batches,
    }


def get_recent_enrollments(limit: int = 5):
    """
    Return the most recent enrollments with useful related data preloaded.
    """
    return (
        Enrollment.objects.select_related(
            "student",
            "batch",
            "batch__course",
        )
        .order_by("-created_at")[:limit]
    )


def get_new_enrollments_today() -> int:
    """
    Count enrollments created today.
    """
    today = timezone.localdate()
    return Enrollment.objects.filter(
        created_at__date=today
    ).count()


def get_new_enrollments_this_week() -> int:
    """
    Count enrollments created in the last 7 days.
    """
    week_ago = timezone.localdate() - timedelta(days=7)
    return Enrollment.objects.filter(
        created_at__date__gte=week_ago
    ).count()


def get_active_enrollments_per_course() -> list[dict]:
    """
    Return active enrollment counts grouped by course.
    Useful for Registrar to see cohort sizes.
    """
    return (
        Enrollment.objects.filter(status=Enrollment.StatusChoices.ACTIVE)
        .values("batch__course__code", "batch__course__title")
        .annotate(count=Count("id"))
        .order_by("-count")
    )


def get_approaching_completion_enrollments(days_ahead: int = 14, limit: int = 5):
    """
    Return enrollments whose batch end dates are approaching.
    Useful for Registrar to proactively manage completion.
    """
    today = timezone.localdate()
    deadline = today + timedelta(days=days_ahead)
    
    return (
        Enrollment.objects.filter(
            status=Enrollment.StatusChoices.ACTIVE,
            batch__end_date__gte=today,
            batch__end_date__lte=deadline
        )
        .select_related("student", "batch", "batch__course")
        .order_by("batch__end_date")[:limit]
    )

