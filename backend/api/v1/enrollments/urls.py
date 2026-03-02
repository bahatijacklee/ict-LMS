"""
Enrollments URL Configuration
"""

from django.urls import path
from api.v1.enrollments.views import (
    EnrollmentListView,
    EnrollmentDetailView,
    EnrollmentCreateView,
    EnrollmentUpdateView,
    MyEnrollmentsView,
)

app_name = 'enrollments'

urlpatterns = [
    # Student's own enrollments
    path('me/', MyEnrollmentsView.as_view(), name='my-enrollments'),
    
    # Admin enrollment management
    path('', EnrollmentListView.as_view(), name='enrollment-list'),
    path('create/', EnrollmentCreateView.as_view(), name='enrollment-create'),
    path('<uuid:id>/', EnrollmentDetailView.as_view(), name='enrollment-detail'),
    path('<uuid:id>/update/', EnrollmentUpdateView.as_view(), name='enrollment-update'),
]
