"""
Advanced Filtering for API Endpoints

This module provides reusable filter classes for common filtering patterns
across the API, such as date ranges, status filters, and role-based queries.
"""

from django_filters import rest_framework as filters
from enrollments.models import Enrollment
from finance.models import Payment
from courses.models import Course, Batch


class EnrollmentFilter(filters.FilterSet):
    """
    Filtering for enrollment endpoints.
    
    Examples:
    - /api/v1/enrollments/?status=ACTIVE
    - /api/v1/enrollments/?batch=uuid
    - /api/v1/enrollments/?created_after=2026-01-01
    """
    status = filters.ChoiceFilter(choices=Enrollment.StatusChoices.choices)
    batch = filters.UUIDFilter(field_name='batch__id')
    student = filters.UUIDFilter(field_name='student__id')
    created_after = filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Enrollment
        fields = ['status', 'batch', 'student', 'created_after', 'created_before']


class PaymentFilter(filters.FilterSet):
    """
    Filtering for payment endpoints.
    
    Examples:
    - /api/v1/payments/?method=MPESA
    - /api/v1/payments/?enrollment=uuid
    - /api/v1/payments/?date_after=2026-01-01
    - /api/v1/payments/?amount_min=1000&amount_max=5000
    """
    method = filters.ChoiceFilter(choices=Payment.PaymentMethod.choices)
    enrollment = filters.UUIDFilter(field_name='enrollment__id')
    date_after = filters.DateFilter(field_name='payment_date', lookup_expr='gte')
    date_before = filters.DateFilter(field_name='payment_date', lookup_expr='lte')
    amount_min = filters.NumberFilter(field_name='amount', lookup_expr='gte')
    amount_max = filters.NumberFilter(field_name='amount', lookup_expr='lte')
    
    class Meta:
        model = Payment
        fields = ['method', 'enrollment', 'date_after', 'date_before', 'amount_min', 'amount_max']


class BatchFilter(filters.FilterSet):
    """
    Filtering for batch endpoints.
    
    Examples:
    - /api/v1/batches/?course=uuid
    - /api/v1/batches/?instructor=uuid
    - /api/v1/batches/?start_date_after=2026-01-01
    - /api/v1/batches/?active=true
    """
    course = filters.UUIDFilter(field_name='course__id')
    instructor = filters.UUIDFilter(field_name='instructor__id')
    start_date_after = filters.DateFilter(field_name='start_date', lookup_expr='gte')
    start_date_before = filters.DateFilter(field_name='start_date', lookup_expr='lte')
    end_date_after = filters.DateFilter(field_name='end_date', lookup_expr='gte')
    end_date_before = filters.DateFilter(field_name='end_date', lookup_expr='lte')
    
    class Meta:
        model = Batch
        fields = ['course', 'instructor', 'start_date_after', 'start_date_before', 'end_date_after', 'end_date_before']
