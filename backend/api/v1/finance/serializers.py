"""
Finance and Payment Serializers

Handles payment tracking and financial data serialization.
Finance officers can create payments, students can view their payment history.
"""

from rest_framework import serializers
from finance.models import Payment
from api.v1.accounts.serializers import UserBasicSerializer
from api.v1.enrollments.serializers import EnrollmentListSerializer
from decimal import Decimal


class PaymentListSerializer(serializers.ModelSerializer):
    """
    Lightweight payment serializer for list views.
    """
    
    student_name = serializers.SerializerMethodField()
    course_title = serializers.SerializerMethodField()
    method_display = serializers.CharField(source='get_method_display', read_only=True)
    received_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'student_name',
            'course_title',
            'amount',
            'method',
            'method_display',
            'reference_number',
            'payment_date',
            'received_by_name',
            'created_at',
        ]
        read_only_fields = ['id', 'payment_date', 'created_at']
    
    def get_student_name(self, obj):
        """Return student's full name."""
        student = obj.enrollment.student
        return f"{student.first_name} {student.last_name}".strip() or student.username
    
    def get_course_title(self, obj):
        """Return course title."""
        return obj.enrollment.batch.course.title
    
    def get_received_by_name(self, obj):
        """Return name of staff who recorded the payment."""
        staff = obj.received_by
        return f"{staff.first_name} {staff.last_name}".strip() or staff.username


class PaymentDetailSerializer(serializers.ModelSerializer):
    """
    Detailed payment information with full nested relationships.
    """
    
    enrollment = EnrollmentListSerializer(read_only=True)
    received_by = UserBasicSerializer(read_only=True)
    method_display = serializers.CharField(source='get_method_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'enrollment',
            'amount',
            'method',
            'method_display',
            'reference_number',
            'payment_date',
            'received_by',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'payment_date', 'created_at', 'updated_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for recording new payments (Finance Officer only).
    """
    
    class Meta:
        model = Payment
        fields = [
            'enrollment',
            'amount',
            'method',
            'reference_number',
        ]
    
    def validate(self, data):
        """
        Validate payment data:
        1. Amount must be positive
        2. Enrollment must be ACTIVE
        3. M-Pesa payments must have reference number
        """
        amount = data.get('amount')
        enrollment = data.get('enrollment')
        method = data.get('method')
        reference_number = data.get('reference_number')
        
        # Validate amount
        if amount <= 0:
            raise serializers.ValidationError({
                'amount': 'Payment amount must be greater than zero.'
            })
        
        # Check enrollment status
        if enrollment.status != 'ACTIVE':
            raise serializers.ValidationError({
                'enrollment': f'Cannot record payment for {enrollment.get_status_display()} enrollment.'
            })
        
        # M-Pesa payments should have reference
        if method == 'MPESA' and not reference_number:
            raise serializers.ValidationError({
                'reference_number': 'M-Pesa payments must include a transaction reference number.'
            })
        
        # Check if payment exceeds balance
        from django.db.models import Sum
        total_paid = enrollment.payments.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        balance = enrollment.agreed_fee - total_paid
        
        if amount > balance:
            raise serializers.ValidationError({
                'amount': f'Payment amount (KES {amount}) exceeds remaining balance (KES {balance}).'
            })
        
        return data
    
    def create(self, validated_data):
        """
        Create payment and automatically set received_by to current user.
        """
        user = self.context['request'].user
        validated_data['received_by'] = user
        return super().create(validated_data)


class PaymentSummarySerializer(serializers.Serializer):
    """
    Serializer for payment summary statistics.
    Used for finance dashboard KPIs.
    """
    
    total_collected = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_count = serializers.IntegerField()
    cash_total = serializers.DecimalField(max_digits=12, decimal_places=2)
    mpesa_total = serializers.DecimalField(max_digits=12, decimal_places=2)
    bank_total = serializers.DecimalField(max_digits=12, decimal_places=2)
    today_collection = serializers.DecimalField(max_digits=12, decimal_places=2)
    this_month_collection = serializers.DecimalField(max_digits=12, decimal_places=2)
