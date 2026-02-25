from datetime import timedelta
from django.db.models import Count
from django.utils import timezone

from .models import Course, Batch


def get_active_courses_count() -> int:
    """
    Return the count of active courses (those with at least one batch).
    """
    return Course.objects.filter(batches__isnull=False).distinct().count()


def get_upcoming_batches(days_ahead: int = 30, limit: int = 5):
    """
    Return batches that start within the specified days.
    Useful for IT Admin to see upcoming teaching schedules.
    """
    today = timezone.localdate()
    deadline = today + timedelta(days=days_ahead)
    
    return (
        Batch.objects.filter(
            start_date__gte=today,
            start_date__lte=deadline
        )
        .select_related("course", "instructor")
        .order_by("start_date")[:limit]
    )


def get_instructor_load() -> list[dict]:
    """
    Return the number of batches assigned to each instructor.
    Useful for IT Admin to see instructor workload.
    """
    return (
        Batch.objects.filter(instructor__isnull=False)
        .values("instructor__username", "instructor__first_name", "instructor__last_name")
        .annotate(batch_count=Count("id"))
        .order_by("-batch_count")
    )
