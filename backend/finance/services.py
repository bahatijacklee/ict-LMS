from decimal import Decimal
from datetime import timedelta

from django.db.models import DecimalField, ExpressionWrapper, F, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone

from .models import Payment
from enrollments.models import Enrollment


def get_finance_dashboard_stats() -> dict:
    """
    Aggregate finance statistics for the admin dashboard.
    """
    today = timezone.localdate()

    payments_today = (
        Payment.objects.filter(payment_date=today).aggregate(total=Sum("amount"))[
            "total"
        ]
        or Decimal("0")
    )

    payments_this_month = (
        Payment.objects.filter(
            payment_date__year=today.year, payment_date__month=today.month
        ).aggregate(total=Sum("amount"))["total"]
        or Decimal("0")
    )

    outstanding = (
        Enrollment.objects.annotate(
            paid_amount=Coalesce(Sum("payments__amount"), Decimal("0"))
        ).aggregate(
            outstanding_total=Sum(
                ExpressionWrapper(
                    F("agreed_fee") - F("paid_amount"),
                    output_field=DecimalField(max_digits=10, decimal_places=2),
                )
            )
        )["outstanding_total"]
        or Decimal("0")
    )

    return {
        "payments_today": payments_today,
        "payments_this_month": payments_this_month,
        "outstanding_total": outstanding,
    }


def get_recent_payments(limit: int = 5):
    """
    Return the most recent payments with related enrollment, student and course.
    """
    return (
        Payment.objects.select_related(
            "enrollment",
            "enrollment__student",
            "enrollment__batch",
            "enrollment__batch__course",
        )
        .order_by("-payment_date", "-created_at")[:limit]
    )


def get_top_debtors(limit: int = 5):
    """
    Return enrollments with the highest outstanding balances.
    Includes 'is_overdue' flag if balance unpaid for more than 30 days.
    Useful for Finance Officer to prioritize collection efforts.
    """
    today = timezone.localdate()
    
    debtors = (
        Enrollment.objects.annotate(
            paid_amount=Coalesce(Sum("payments__amount"), Decimal("0")),
            outstanding=ExpressionWrapper(
                F("agreed_fee") - F("paid_amount"),
                output_field=DecimalField(max_digits=10, decimal_places=2),
            )
        )
        .filter(outstanding__gt=Decimal("0"))
        .select_related("student", "batch", "batch__course")
        .order_by("-outstanding")[:limit]
    )
    
    # Add overdue flag to each debtor (unpaid for >30 days)
    for debtor in debtors:
        days_since_enrollment = (today - debtor.created_at.date()).days
        debtor.is_overdue = days_since_enrollment > 30
    
    return debtors


def get_revenue_by_course() -> list[dict]:
    """
    Return total revenue collected per course.
    Useful for Super Admin to see which courses generate the most revenue.
    """
    return (
        Payment.objects.select_related(
            "enrollment",
            "enrollment__batch",
            "enrollment__batch__course",
        )
        .values("enrollment__batch__course__code", "enrollment__batch__course__title")
        .annotate(total_revenue=Sum("amount"))
        .order_by("-total_revenue")
    )

