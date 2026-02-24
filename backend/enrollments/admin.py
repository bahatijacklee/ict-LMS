from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Enrollment

@admin.register(Enrollment)
class EnrollmentAdmin(ModelAdmin): # Changed here
    list_display = ('student', 'batch', 'status', 'agreed_fee', 'created_at')
    list_filter = ('status', 'batch__course', 'is_active')
    search_fields = ('student__username', 'student__first_name', 'student__last_name', 'batch__name')
    autocomplete_fields = ('student', 'batch')
