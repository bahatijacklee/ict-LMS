"""
Enrollment API Views

Endpoints for viewing and managing student enrollments.
Students can view their own enrollments, admins can create and update.
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from enrollments.models import Enrollment
from api.v1.enrollments.serializers import (
    EnrollmentListSerializer,
    EnrollmentDetailSerializer,
    EnrollmentCreateSerializer,
    EnrollmentUpdateSerializer,
)
from api.pagination import StandardResultsSetPagination
from api.filters import EnrollmentFilter
from api.permissions import IsStudent, IsITAdmin


class EnrollmentListView(generics.ListAPIView):
    """
    GET /api/v1/enrollments/
    
    List all enrollments (Admin only).
    Supports filtering by status, batch, student, dates.
    """
    
    queryset = Enrollment.objects.all().select_related(
        'student', 'batch__course'
    ).order_by('-created_at')
    serializer_class = EnrollmentListSerializer
    permission_classes = [IsITAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = EnrollmentFilter
    search_fields = [
        'student__username',
        'student__email',
        'student__first_name',
        'student__last_name',
        'batch__name',
        'batch__course__title',
    ]
    ordering_fields = ['created_at', 'agreed_fee', 'status']
    ordering = ['-created_at']


class EnrollmentDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/enrollments/{id}/
    
    Retrieve detailed enrollment information.
    Students can only view their own enrollments, admins can view all.
    """
    
    queryset = Enrollment.objects.all().select_related(
        'student', 'batch__course', 'batch__instructor'
    )
    serializer_class = EnrollmentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        """Filter based on user role."""
        user = self.request.user
        
        # Students can only see their own enrollments
        if user.role == 'STUDENT':
            return self.queryset.filter(student=user)
        
        # Admins can see all
        return self.queryset


class EnrollmentCreateView(generics.CreateAPIView):
    """
    POST /api/v1/enrollments/
    
    Create a new enrollment (Registrar/Admin only).
    
    Request:
    {
        "student": "uuid",
        "batch": "uuid",
        "agreed_fee": 15000.00,
        "status": "ACTIVE"
    }
    """
    
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentCreateSerializer
    permission_classes = [IsITAdmin]
    
    def create(self, request, *args, **kwargs):
        """Create enrollment with custom response."""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            enrollment = serializer.save()
            detail_serializer = EnrollmentDetailSerializer(enrollment)
            
            return Response({
                'status': 'success',
                'data': detail_serializer.data,
                'message': 'Enrollment created successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'status': 'error',
            'code': 'VALIDATION_ERROR',
            'message': 'Enrollment creation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class EnrollmentUpdateView(generics.UpdateAPIView):
    """
    PATCH /api/v1/enrollments/{id}/
    
    Update enrollment status (Registrar/Admin only).
    Only the status field can be updated.
    """
    
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentUpdateSerializer
    permission_classes = [IsITAdmin]
    lookup_field = 'id'
    
    def update(self, request, *args, **kwargs):
        """Update enrollment with custom response."""
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            enrollment = serializer.save()
            detail_serializer = EnrollmentDetailSerializer(enrollment)
            
            return Response({
                'status': 'success',
                'data': detail_serializer.data,
                'message': 'Enrollment updated successfully'
            })
        
        return Response({
            'status': 'error',
            'code': 'VALIDATION_ERROR',
            'message': 'Enrollment update failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class MyEnrollmentsView(generics.ListAPIView):
    """
    GET /api/v1/enrollments/me/
    
    List all enrollments for the current student.
    Only accessible by users with STUDENT role.
    """
    
    serializer_class = EnrollmentListSerializer
    permission_classes = [IsStudent]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """Return only enrollments for the current user."""
        return Enrollment.objects.filter(
            student=self.request.user
        ).select_related(
            'batch__course', 'batch__instructor'
        ).order_by('-created_at')
