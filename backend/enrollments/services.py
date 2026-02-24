from django.db.models import Count

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

