from django.contrib import admin
from django.db.models import Count
from unfold.admin import ModelAdmin
from .models import Course, Batch

@admin.register(Course)
class CourseAdmin(ModelAdmin): # Changed here
    list_display = ('code', 'title', 'base_fee', 'is_active', 'enrollment_count')
    search_fields = ('code', 'title')
    list_filter = ('is_active', 'created_at')
    list_per_page = 25

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(enrollment_total=Count('batches__enrollments'))

    @admin.display(description="Enrollments", ordering='enrollment_total')
    def enrollment_count(self, obj):
        return getattr(obj, 'enrollment_total', 0)

@admin.register(Batch)
class BatchAdmin(ModelAdmin): # Changed here
    list_display = (
        'name',
        'course',
        'instructor',
        'start_date',
        'end_date',
        'is_active',
        'enrollment_count',
    )
    search_fields = ('name', 'course__title', 'course__code')
    list_filter = ('start_date', 'end_date', 'is_active')
    autocomplete_fields = ('course', 'instructor')
    list_per_page = 25

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('course', 'instructor').annotate(
            enrollment_total=Count('enrollments')
        )

    @admin.display(description="Enrollments", ordering='enrollment_total')
    def enrollment_count(self, obj):
        return getattr(obj, 'enrollment_total', 0)
