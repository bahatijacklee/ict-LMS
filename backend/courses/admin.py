from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Course, Batch

@admin.register(Course)
class CourseAdmin(ModelAdmin): # Changed here
    list_display = ('code', 'title', 'base_fee', 'is_active')
    search_fields = ('code', 'title')
    list_filter = ('is_active', 'created_at')

@admin.register(Batch)
class BatchAdmin(ModelAdmin): # Changed here
    list_display = ('name', 'course', 'instructor', 'start_date', 'end_date', 'is_active')
    search_fields = ('name', 'course__title', 'course__code')
    list_filter = ('start_date', 'end_date', 'is_active')
    autocomplete_fields = ('course', 'instructor')
