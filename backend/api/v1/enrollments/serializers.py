"""
Enrollment Serializers

Handles student enrollment data serialization.
Students can view their own enrollments, admins can view and manage all.
"""

from rest_framework import serializers
from enrollments.models import Enrollment
from api.v1.accounts.serializers import UserBasicSerializer
from api.v1.courses.serializers import BatchListSerializer, CourseListSerializer
from decimal import Decimal


class EnrollmentListSerializer(serializers.ModelSerializer):
    """
    Lightweight enrollment serializer for list views.
    """
    
    student_name = serializers.SerializerMethodField()
    batch_name = serializers.CharField(source='batch.name', read_only=True)
    course_code = serializers.CharField(source='batch.course.code', read_only=True)
    course_title = serializers.CharField(source='batch.course.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    total_paid = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = [
            'id',
            'student_name',
            'batch_name',
            'course_code',
            'course_title',
            'status',
            'status_display',
            'agreed_fee',
            'total_paid',
            'balance',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_student_name(self, obj):
        """Return student's full name."""
        return f"{obj.student.first_name} {obj.student.last_name}".strip() or obj.student.username
    
    def get_total_paid(self, obj):
        """Calculate total payments made for this enrollment."""
        total = obj.payments.aggregate(total=serializers.models.Sum('amount'))['total']
        return total or Decimal('0.00')
    
    def get_balance(self, obj):
        """Calculate remaining balance."""
        total_paid = self.get_total_paid(obj)
        return obj.agreed_fee - total_paid


class EnrollmentDetailSerializer(serializers.ModelSerializer):
    """
    Detailed enrollment information with nested relationships.
    """
    
    student = UserBasicSerializer(read_only=True)
    batch = BatchListSerializer(read_only=True)
    course = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_summary = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = [
            'id',
            'student',
            'batch',
            'course',
            'status',
            'status_display',
            'agreed_fee',
            'payment_summary',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_course(self, obj):
        """Return course information."""
        return CourseListSerializer(obj.batch.course).data
    
    def get_payment_summary(self, obj):
        """Return payment summary for this enrollment."""
        from django.db.models import Sum
        total_paid = obj.payments.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        balance = obj.agreed_fee - total_paid
        payment_count = obj.payments.count()
        
        return {
            'agreed_fee': obj.agreed_fee,
            'total_paid': total_paid,
            'balance': balance,
            'payment_count': payment_count,
            'is_fully_paid': balance <= 0,
        }


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer  for creating new enrollments (Admin/Registrar only).
    """
    
    class Meta:
        model = Enrollment
        fields = [
            'student',
            'batch',
            'agreed_fee',
            'status',
        ]
    
    def validate(self, data):
        """
        Validate enrollment data:
        1. Student must have STUDENT role
        2. Cannot enroll same student in same batch twice
        3. Agreed fee must be positive
        """
        student = data.get('student')
        batch = data.get('batch')
        agreed_fee = data.get('agreed_fee')
        
        # Check student role
        if student.role != 'STUDENT':
            raise serializers.ValidationError({
                'student': 'Selected user must have STUDENT role.'
            })
        
        # Check for duplicate enrollment
        if Enrollment.objects.filter(student=student, batch=batch).exists():
            raise serializers.ValidationError({
                'batch': 'This student is already enrolled in this batch.'
            })
        
        # Validate fee
        if agreed_fee <= 0:
            raise serializers.ValidationError({
                'agreed_fee': 'Agreed fee must be greater than zero.'
            })
        
        return data


class EnrollmentUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating enrollment status.
    Only status can be changed after creation.
    """
    
    class Meta:
        model = Enrollment
        fields = ['status']
    
    def validate_status(self, value):
        """Ensure valid status transitions."""
        instance = self.instance
        if instance:
            # Define valid transitions
            valid_transitions = {
                'ACTIVE': ['COMPLETED', 'SUSPENDED', 'DROPPED'],
                'SUSPENDED': ['ACTIVE', 'DROPPED'],
                'COMPLETED': [],  # Once completed, cannot change
                'DROPPED': [],  # Once dropped, cannot reactivate
            }
            
            current_status = instance.status
            if current_status in ['COMPLETED', 'DROPPED'] and value != current_status:
                raise serializers.ValidationError(
                    f"Cannot change status from {current_status} to {value}."
                )
            
            if value not in valid_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"Invalid status transition from {current_status} to {value}."
                )
        
        return value
