"""
Finance and Payment API Views

Endpoints for payment tracking and financial operations.
Finance officers can record payments, students can view their payment history.
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Sum, Count, Q
from django.utils import timezone
from decimal import Decimal

from finance.models import Payment
from enrollments.models import Enrollment
from api.v1.finance.serializers import (
    PaymentListSerializer,
    PaymentDetailSerializer,
    PaymentCreateSerializer,
    PaymentSummarySerializer,
)
from api.pagination import StandardResultsSetPagination, LargeResultsSetPagination
from api.filters import PaymentFilter
from api.permissions import IsFinanceOfficer, IsStudent


class PaymentListView(generics.ListAPIView):
    """
    GET /api/v1/payments/
    
    List all payments (Finance Officer only).
    Supports filtering by method, enrollment, date range, amount.
    """
    
    queryset = Payment.objects.all().select_related(
        'enrollment__student',
        'enrollment__batch__course',
        'received_by'
    ).order_by('-payment_date', '-created_at')
    serializer_class = PaymentListSerializer
    permission_classes = [IsFinanceOfficer]
    pagination_class = LargeResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = PaymentFilter
    search_fields = [
        'enrollment__student__username',
        'enrollment__student__first_name',
        'enrollment__student__last_name',
        'reference_number',
    ]
    ordering_fields = ['payment_date', 'amount', 'created_at']
    ordering = ['-payment_date', '-created_at']


class PaymentDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/payments/{id}/
    
    Retrieve detailed payment information.
    Students can only view their own payments, finance officers can view all.
    """
    
    queryset = Payment.objects.all().select_related(
        'enrollment__student',
        'enrollment__batch__course',
        'received_by'
    )
    serializer_class = PaymentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        """Filter based on user role."""
        user = self.request.user
        
        # Students can only see their own payments
        if user.role == 'STUDENT':
            return self.queryset.filter(enrollment__student=user)
        
        # Finance officers and admins can see all
        if user.role in ['FINANCE', 'IT_ADMIN', 'SUPER_ADMIN']:
            return self.queryset
        
        # Default: empty queryset
        return self.queryset.none()


class PaymentCreateView(generics.CreateAPIView):
    """
    POST /api/v1/payments/
    
    Record a new payment (Finance Officer only).
    
    Request:
    {
        "enrollment": "uuid",
        "amount": 5000.00,
        "method": "MPESA",
        "reference_number": "ABC123XYZ"
    }
    """
    
    queryset = Payment.objects.all()
    serializer_class = PaymentCreateSerializer
    permission_classes = [IsFinanceOfficer]
    
    def create(self, request, *args, **kwargs):
        """Create payment with custom response."""
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            payment = serializer.save()
            detail_serializer = PaymentDetailSerializer(payment)
            
            return Response({
                'status': 'success',
                'data': detail_serializer.data,
                'message': 'Payment recorded successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'status': 'error',
            'code': 'VALIDATION_ERROR',
            'message': 'Payment creation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class MyPaymentsView(generics.ListAPIView):
    """
    GET /api/v1/payments/me/
    
    List all payments for the current student.
    Only accessible by users with STUDENT role.
    """
    
    serializer_class = PaymentListSerializer
    permission_classes = [IsStudent]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """Return only payments for the current user's enrollments."""
        return Payment.objects.filter(
            enrollment__student=self.request.user
        ).select_related(
            'enrollment__batch__course',
            'received_by'
        ).order_by('-payment_date', '-created_at')


class PaymentSummaryView(APIView):
    """
    GET /api/v1/payments/summary/
    
    Get payment statistics for finance dashboard.
    Only accessible by Finance Officers and Admins.
    """
    
    permission_classes = [IsFinanceOfficer]
    
    def get(self, request):
        """Calculate and return payment summary statistics."""
        today = timezone.now().date()
        first_day_of_month = today.replace(day=1)
        
        # Total collected (all time)
        total_stats = Payment.objects.aggregate(
            total_collected=Sum('amount'),
            payment_count=Count('id')
        )
        
        # By payment method
        method_stats = {
            'cash_total': Payment.objects.filter(method='CASH').aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00'),
            'mpesa_total': Payment.objects.filter(method='MPESA').aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00'),
            'bank_total': Payment.objects.filter(method='BANK').aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00'),
        }
        
        # Today's collection
        today_collection = Payment.objects.filter(
            payment_date=today
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        # This month's collection
        month_collection = Payment.objects.filter(
            payment_date__gte=first_day_of_month
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        summary_data = {
            'total_collected': total_stats['total_collected'] or Decimal('0.00'),
            'payment_count': total_stats['payment_count'] or 0,
            'today_collection': today_collection,
            'this_month_collection': month_collection,
            **method_stats,
        }
        
        serializer = PaymentSummarySerializer(summary_data)
        
        return Response({
            'status': 'success',
            'data': serializer.data
        })
