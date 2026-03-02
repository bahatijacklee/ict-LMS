"""
Courses and Batches API Views

Endpoints for viewing course catalog and batch information.
Students can view courses, instructors can view their assigned batches.
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from courses.models import Course, Batch
from api.v1.courses.serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    BatchListSerializer,
    BatchDetailSerializer,
    BatchStudentsSerializer,
)
from api.pagination import StandardResultsSetPagination
from api.filters import BatchFilter
from api.permissions import IsStudentOrReadOnly, IsInstructor


class CourseListView(generics.ListAPIView):
    """
    GET /api/v1/courses/
    
    List all available courses (public for authenticated users).
    Supports search by title, code, or description.
    
    Query parameters:
    - search: Search in title, code, description
    - ordering: Order by title, code, base_fee, created_at
    - page: Page number
    - page_size: Results per page (max 100)
    """
    
    queryset = Course.objects.all().order_by('code')
    serializer_class = CourseListSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['title', 'code', 'description']
    ordering_fields = ['title', 'code', 'base_fee', 'created_at']
    ordering = ['code']


class CourseDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/courses/{id}/
    
    Retrieve detailed information about a specific course.
    Includes all batches for this course.
    """
    
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'


class BatchListView(generics.ListAPIView):
    """
    GET /api/v1/batches/
    
    List all batches (filtered by course, instructor, dates).
    
    Query parameters:
    - course: Filter by course ID
    - instructor: Filter by instructor ID
    - start_date_after: Batches starting after this date
    - start_date_before: Batches starting before this date
    - search: Search in batch name
    """
    
    queryset = Batch.objects.all().select_related('course', 'instructor').order_by('-start_date')
    serializer_class = BatchListSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BatchFilter
    search_fields = ['name', 'course__title', 'course__code']
    ordering_fields = ['start_date', 'end_date', 'created_at']
    ordering = ['-start_date']


class BatchDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/batches/{id}/
    
    Retrieve detailed information about a specific batch.
    """
    
    queryset = Batch.objects.all().select_related('course', 'instructor')
    serializer_class = BatchDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'


class BatchStudentsView(APIView):
    """
    GET /api/v1/batches/{id}/students/
    
    List all students enrolled in a batch.
    Only accessible by the assigned instructor or admins.
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, id):
        """Return list of students in the batch."""
        try:
            batch = Batch.objects.get(id=id)
        except Batch.DoesNotExist:
            return Response({
                'status': 'error',
                'code': 'NOT_FOUND',
                'message': 'Batch not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Permission check: Only instructor of this batch or admin
        user = request.user
        is_instructor = (user.role == 'INSTRUCTOR' and batch.instructor == user)
        is_admin = user.role in ['IT_ADMIN', 'SUPER_ADMIN']
        
        if not (is_instructor or is_admin):
            return Response({
                'status': 'error',
                'code': 'PERMISSION_DENIED',
                'message': 'You do not have permission to view students in this batch'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = BatchStudentsSerializer(batch)
        return Response({
            'status': 'success',
            'data': serializer.data
        })


class MyBatchesView(generics.ListAPIView):
    """
    GET /api/v1/batches/my/
    
    List all batches assigned to the current instructor.
    Only accessible by users with INSTRUCTOR role.
    """
    
    serializer_class = BatchListSerializer
    permission_classes = [IsInstructor]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """Return only batches where current user is the instructor."""
        return Batch.objects.filter(
            instructor=self.request.user
        ).select_related('course', 'instructor').order_by('-start_date')
