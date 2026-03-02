"""
Statistics and Dashboard API Views

Provides role-aware dashboard data and KPIs.
Different users see different statistics based on their role.
"""

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q
from django.utils import timezone
from decimal import Decimal

from accounts.models import User
from courses.models import Course, Batch
from enrollments.models import Enrollment
from finance.models import Payment
from api.v1.stats.serializers import (
    StudentDashboardSerializer,
    InstructorDashboardSerializer,
    FinanceDashboardSerializer,
    AdminDashboardSerializer,
)


class DashboardView(APIView):
    """
    GET /api/v1/stats/dashboard/
    
    Get role-aware dashboard statistics for the current user.
    Returns different data based on user role:
    - STUDENT: Personal enrollment and payment stats
    - INSTRUCTOR: Classes teaching and student counts
    - FINANCE: Payment collection metrics
    - IT_ADMIN/SUPER_ADMIN: Institution-wide statistics
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Return role-appropriate dashboard data."""
        user = request.user
        
        if user.role == 'STUDENT':
            data = self._get_student_dashboard(user)
            serializer = StudentDashboardSerializer(data)
        elif user.role == 'INSTRUCTOR':
            data = self._get_instructor_dashboard(user)
            serializer = InstructorDashboardSerializer(data)
        elif user.role == 'FINANCE':
            data = self._get_finance_dashboard(user)
            serializer = FinanceDashboardSerializer(data)
        elif user.role in ['IT_ADMIN', 'SUPER_ADMIN']:
            data = self._get_admin_dashboard(user)
            serializer = AdminDashboardSerializer(data)
        else:
            return Response({
                'status': 'error',
                'code': 'INVALID_ROLE',
                'message': 'Invalid user role for dashboard access'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def _get_student_dashboard(self, user):
        """Calculate dashboard stats for students."""
        enrollments = Enrollment.objects.filter(student=user)
        
        total_enrollments = enrollments.count()
        active_enrollments = enrollments.filter(status='ACTIVE').count()
        completed_courses = enrollments.filter(status='COMPLETED').count()
        
        # Calculate financial summary
        total_fees_owed = enrollments.aggregate(
            total=Sum('agreed_fee')
        )['total'] or Decimal('0.00')
        
        total_paid = Payment.objects.filter(
            enrollment__student=user
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        outstanding_balance = total_fees_owed - total_paid
        
        # Recent enrollments
        recent_enrollments = []
        for enrollment in enrollments.select_related('batch__course').order_by('-created_at')[:5]:
            recent_enrollments.append({
                'id': str(enrollment.id),
                'course_title': enrollment.batch.course.title,
                'batch_name': enrollment.batch.name,
                'status': enrollment.status,
                'enrolled_date': enrollment.created_at.isoformat(),
            })
        
        return {
            'total_enrollments': total_enrollments,
            'active_enrollments': active_enrollments,
            'completed_courses': completed_courses,
            'total_fees_owed': total_fees_owed,
            'total_paid': total_paid,
            'outstanding_balance': outstanding_balance,
            'recent_enrollments': recent_enrollments,
        }
    
    def _get_instructor_dashboard(self, user):
        """Calculate dashboard stats for instructors."""
        batches = Batch.objects.filter(instructor=user)
        
        total_batches_teaching = batches.count()
        
        # Active batches (ongoing)
        today = timezone.now().date()
        active_batches = batches.filter(
            start_date__lte=today,
            end_date__gte=today
        ).count()
        
        # Total students across all batches
        total_students = Enrollment.objects.filter(
            batch__instructor=user,
            status='ACTIVE'
        ).count()
        
        # Upcoming classes
        upcoming_classes = []
        for batch in batches.filter(end_date__gte=today).select_related('course').order_by('start_date')[:5]:
            upcoming_classes.append({
                'id': str(batch.id),
                'name': batch.name,
                'course_title': batch.course.title,
                'start_date': batch.start_date.isoformat(),
                'end_date': batch.end_date.isoformat(),
                'student_count': batch.enrollments.filter(status='ACTIVE').count(),
            })
        
        return {
            'total_batches_teaching': total_batches_teaching,
            'active_batches': active_batches,
            'total_students': total_students,
            'upcoming_classes': upcoming_classes,
        }
    
    def _get_finance_dashboard(self, user):
        """Calculate dashboard stats for finance officers."""
        today = timezone.now().date()
        first_day_of_month = today.replace(day=1)
        
        # Today's collection
        today_payments = Payment.objects.filter(payment_date=today)
        total_collected_today = today_payments.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        payment_count_today = today_payments.count()
        
        # This month's collection
        total_collected_this_month = Payment.objects.filter(
            payment_date__gte=first_day_of_month
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        # Outstanding balance (all active enrollments)
        active_enrollments = Enrollment.objects.filter(status='ACTIVE')
        total_owed = active_enrollments.aggregate(
            total=Sum('agreed_fee')
        )['total'] or Decimal('0.00')
        
        total_paid_all = Payment.objects.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        total_outstanding = total_owed - total_paid_all
        
        # Recent payments
        recent_payments = []
        for payment in Payment.objects.select_related(
            'enrollment__student',
            'enrollment__batch__course'
        ).order_by('-payment_date', '-created_at')[:10]:
            recent_payments.append({
                'id': str(payment.id),
                'student_name': f"{payment.enrollment.student.first_name} {payment.enrollment.student.last_name}".strip(),
                'course_title': payment.enrollment.batch.course.title,
                'amount': str(payment.amount),
                'method': payment.method,
                'payment_date': payment.payment_date.isoformat(),
            })
        
        return {
            'total_collected_today': total_collected_today,
            'total_collected_this_month': total_collected_this_month,
            'total_outstanding': total_outstanding,
            'payment_count_today': payment_count_today,
            'recent_payments': recent_payments,
        }
    
    def _get_admin_dashboard(self, user):
        """Calculate dashboard stats for admins."""
        # Student statistics
        total_students = User.objects.filter(role='STUDENT').count()
        active_students = Enrollment.objects.filter(
            status='ACTIVE'
        ).values('student').distinct().count()
        
        # Course statistics
        total_courses = Course.objects.count()
        
        # Batch statistics
        today = timezone.now().date()
        active_batches = Batch.objects.filter(
            start_date__lte=today,
            end_date__gte=today
        ).count()
        
        # Financial statistics
        total_revenue = Payment.objects.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        total_owed = Enrollment.objects.filter(
            status='ACTIVE'
        ).aggregate(total=Sum('agreed_fee'))['total'] or Decimal('0.00')
        
        outstanding_balance = total_owed - total_revenue
        
        # Recent enrollments
        recent_enrollments = []
        for enrollment in Enrollment.objects.select_related(
            'student',
            'batch__course'
        ).order_by('-created_at')[:10]:
            recent_enrollments.append({
                'id': str(enrollment.id),
                'student_name': f"{enrollment.student.first_name} {enrollment.student.last_name}".strip(),
                'course_title': enrollment.batch.course.title,
                'batch_name': enrollment.batch.name,
                'status': enrollment.status,
                'enrolled_date': enrollment.created_at.isoformat(),
            })
        
        # Revenue trend (last 6 months)
        revenue_trend = {}
        for i in range(6):
            month_date = today.replace(day=1) - timezone.timedelta(days=i*30)
            month_name = month_date.strftime('%B %Y')
            month_revenue = Payment.objects.filter(
                payment_date__year=month_date.year,
                payment_date__month=month_date.month
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
            revenue_trend[month_name] = str(month_revenue)
        
        return {
            'total_students': total_students,
            'active_students': active_students,
            'total_courses': total_courses,
            'active_batches': active_batches,
            'total_revenue': total_revenue,
            'outstanding_balance': outstanding_balance,
            'recent_enrollments': recent_enrollments,
            'revenue_trend': revenue_trend,
        }
