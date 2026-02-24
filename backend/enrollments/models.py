from django.db import models
from core.models import TimeStampedModel
from django.conf import settings
from courses.models import Batch

class Enrollment(TimeStampedModel):
    """Links a student to a specific batch and locks in their fee."""
    class StatusChoices(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        COMPLETED = 'COMPLETED', 'Completed'
        DROPPED = 'DROPPED', 'Dropped'
        SUSPENDED = 'SUSPENDED', 'Suspended'

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'STUDENT'},
        related_name='enrollments'
    )
    batch = models.ForeignKey(Batch, on_delete=models.PROTECT, related_name='enrollments')
    
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE
    )
    # Why duplicate the fee here? If the Course base_fee increases next year,
    # this student's agreed fee remains unchanged.
    agreed_fee = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        # A student cannot enroll in the exact same batch twice
        unique_together = ('student', 'batch')

    def __str__(self):
        return f"{self.student.username} -> {self.batch.name} ({self.status})"
