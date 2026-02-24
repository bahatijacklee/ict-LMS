from django.db import models
from core.models import TimeStampedModel
from django.conf import settings
from enrollments.models import Enrollment

class Payment(TimeStampedModel):
    """An immutable record of money received."""
    class PaymentMethod(models.TextChoices):
        CASH = 'CASH', 'Cash'
        MPESA = 'MPESA', 'M-Pesa'
        BANK = 'BANK', 'Bank Transfer'

    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.PROTECT,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    
    # E.g., The Safaricom transaction code or physical receipt number
    reference_number = models.CharField(max_length=100, blank=True, null=True, unique=True)
    
    # Audit trail: Which admin/finance officer keyed this into the system?
    received_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='processed_payments'
    )
    payment_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.enrollment.student.username} paid {self.amount} via {self.method}"
