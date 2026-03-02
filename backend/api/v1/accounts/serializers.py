"""
Account Serializers

Serializers for user profile and account management.
Separates read and write operations to prevent accidental exposure of sensitive data.
"""

from rest_framework import serializers
from accounts.models import User


class UserBasicSerializer(serializers.ModelSerializer):
    """
    Minimal user information for nested representations.
    Used when showing user info as part of enrollment, payment, or batch details.
    
    NEVER exposes passwords or sensitive authentication data.
    """
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'role_display',
        ]
        read_only_fields = ['id', 'username', 'email', 'role', 'role_display']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Complete user profile for /api/v1/accounts/me/ endpoint.
    Students and instructors can view their full profile.
    """
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'phone_number',
            'role',
            'role_display',
            'date_joined',
            'last_login',
        ]
        read_only_fields = [
            'id',
            'username',
            'email',
            'role',
            'role_display',
            'date_joined',
            'last_login',
        ]
    
    def get_full_name(self, obj):
        """Construct full name from first and last name."""
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    Users can only update specific fields (not role, not username).
    """
    
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'phone_number',
        ]
    
    def validate_phone_number(self, value):
        """Validate Kenyan phone number format."""
        if value and not value.startswith(('07', '01', '+254')):
            raise serializers.ValidationError(
                "Invalid phone number format. Use format: 0712345678 or +254712345678"
            )
        return value
