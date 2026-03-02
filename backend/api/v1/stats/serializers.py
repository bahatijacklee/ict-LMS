"""
Statistics and Dashboard Serializers

Provides serialization for dashboard KPIs and statistics.
Data is role-aware - students see their own stats, admins see institution-wide stats.
"""

from rest_framework import serializers


class StudentDashboardSerializer(serializers.Serializer):
    """
    Dashboard statistics for students.
    Shows personal progress and financial status.
    """
    
    total_enrollments = serializers.IntegerField()
    active_enrollments = serializers.IntegerField()
    completed_courses = serializers.IntegerField()
    total_fees_owed = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_paid = serializers.DecimalField(max_digits=12, decimal_places=2)
    outstanding_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    recent_enrollments = serializers.ListField()


class InstructorDashboardSerializer(serializers.Serializer):
    """
    Dashboard statistics for instructors.
    Shows classes they're teaching and student counts.
    """
    
    total_batches_teaching = serializers.IntegerField()
    active_batches = serializers.IntegerField()
    total_students = serializers.IntegerField()
    upcoming_classes = serializers.ListField()


class FinanceDashboardSerializer(serializers.Serializer):
    """
    Dashboard statistics for finance officers.
    Shows payment collection metrics.
    """
    
    total_collected_today = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_collected_this_month = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_outstanding = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_count_today = serializers.IntegerField()
    recent_payments = serializers.ListField()


class AdminDashboardSerializer(serializers.Serializer):
    """
    Dashboard statistics for super admins and IT admins.
    Shows institution-wide metrics.
    """
    
    total_students = serializers.IntegerField()
    active_students = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    active_batches = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    outstanding_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    recent_enrollments = serializers.ListField()
    revenue_trend = serializers.DictField()
