from django.db import models
from core.models import TimeStampedModel
from django.conf import settings

class Course(TimeStampedModel):
    """The master blueprint for a subject."""
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True) # e.g., WEB-101
    description = models.TextField()
    base_fee = models.DecimalField(max_digits=10, decimal_places=2, help_text="Default cost in KES")

    def __str__(self):
        return f"{self.code} - {self.title}"

class Batch(TimeStampedModel):
    """A specific instance of a course occurring over a set time."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='batches')
    name = models.CharField(max_length=100) # e.g., "Jan 2026 Morning"
    
    # We restrict this dropdown to only show users with the 'INSTRUCTOR' role
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'INSTRUCTOR'},
        related_name='assigned_batches'
    )
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.course.code} | {self.name}"
