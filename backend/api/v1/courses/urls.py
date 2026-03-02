"""
Courses and Batches URL Configuration
"""

from django.urls import path
from api.v1.courses.views import (
    CourseListView,
    CourseDetailView,
    BatchListView,
    BatchDetailView,
    BatchStudentsView,
    MyBatchesView,
)

app_name = 'courses'

urlpatterns = [
    # Courses
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/<uuid:id>/', CourseDetailView.as_view(), name='course-detail'),
    
    # Batches
    path('batches/', BatchListView.as_view(), name='batch-list'),
    path('batches/my/', MyBatchesView.as_view(), name='my-batches'),
    path('batches/<uuid:id>/', BatchDetailView.as_view(), name='batch-detail'),
    path('batches/<uuid:id>/students/', BatchStudentsView.as_view(), name='batch-students'),
]
