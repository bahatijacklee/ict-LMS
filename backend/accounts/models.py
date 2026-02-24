from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import TimeStampedModel

class User(AbstractUser, TimeStampedModel):
    """
    Custom User model for the Baptist ICT Centre.
    Replaces the default Django user to enforce role-based access control.
    """
    class RoleChoices(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        INSTRUCTOR = 'INSTRUCTOR', 'Instructor'
        FINANCE = 'FINANCE', 'Finance Officer'
        IT_ADMIN = 'IT_ADMIN', 'IT Admin'
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'

    role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.STUDENT
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        # Fallback to username if first/last name aren't set yet
        name = f"{self.first_name} {self.last_name}".strip()
        if not name:
            name = self.username
        return f"{name} ({self.get_role_display()})"
