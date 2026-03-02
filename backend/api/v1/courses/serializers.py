"""
Course and Batch Serializers

Handles serialization for courses and batches.
Different serializers for list views (lightweight) and detail views (with nested data).
"""

from rest_framework import serializers
from courses.models import Course, Batch
from api.v1.accounts.serializers import UserBasicSerializer


class CourseListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for course list views.
    Used by students browsing available courses.
    """
    
    batch_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id',
            'code',
            'title',
            'description',
            'base_fee',
            'batch_count',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_batch_count(self, obj):
        """Return the number of batches for this course."""
        return obj.batches.count()


class CourseDetailSerializer(serializers.ModelSerializer):
    """
    Detailed course information with nested batches.
    Used for /api/v1/courses/{id}/ endpoint.
    """
    
    batches = serializers.SerializerMethodField()
    total_enrollments = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id',
            'code',
            'title',
            'description',
            'base_fee',
            'batches',
            'total_enrollments',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_batches(self, obj):
        """Return active batches for this course."""
        batches = obj.batches.all().order_by('-start_date')
        return BatchListSerializer(batches, many=True).data
    
    def get_total_enrollments(self, obj):
        """Count total enrollments across all batches of this course."""
        from enrollments.models import Enrollment
        return Enrollment.objects.filter(batch__course=obj).count()


class BatchListSerializer(serializers.ModelSerializer):
    """
    Lightweight batch serializer for list views.
    """
    
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    instructor_name = serializers.SerializerMethodField()
    enrollment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Batch
        fields = [
            'id',
            'name',
            'course_code',
            'course_title',
            'instructor_name',
            'start_date',
            'end_date',
            'enrollment_count',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_instructor_name(self, obj):
        """Return instructor's full name if assigned."""
        if obj.instructor:
            return f"{obj.instructor.first_name} {obj.instructor.last_name}".strip() or obj.instructor.username
        return None
    
    def get_enrollment_count(self, obj):
        """Return number of students enrolled in this batch."""
        return obj.enrollments.filter(status='ACTIVE').count()


class BatchDetailSerializer(serializers.ModelSerializer):
    """
    Detailed batch information with nested course and instructor.
    Used for /api/v1/batches/{id}/ endpoint.
    """
    
    course = CourseListSerializer(read_only=True)
    instructor = UserBasicSerializer(read_only=True)
    enrollment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Batch
        fields = [
            'id',
            'name',
            'course',
            'instructor',
            'start_date',
            'end_date',
            'enrollment_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_enrollment_count(self, obj):
        """Return number of students enrolled in this batch."""
        return obj.enrollments.filter(status='ACTIVE').count()


class BatchStudentsSerializer(serializers.ModelSerializer):
    """
    Serializer for instructors to view students in their batch.
    Used by /api/v1/batches/{id}/students/ endpoint.
    """
    
    students = serializers.SerializerMethodField()
    
    class Meta:
        model = Batch
        fields = ['id', 'name', 'students']
    
    def get_students(self, obj):
        """Return list of students enrolled in this batch."""
        from enrollments.models import Enrollment
        enrollments = obj.enrollments.filter(status='ACTIVE').select_related('student')
        return [
            {
                'id': enrollment.student.id,
                'username': enrollment.student.username,
                'email': enrollment.student.email,
                'first_name': enrollment.student.first_name,
                'last_name': enrollment.student.last_name,
                'enrollment_id': enrollment.id,
                'enrollment_date': enrollment.created_at,
            }
            for enrollment in enrollments
        ]
