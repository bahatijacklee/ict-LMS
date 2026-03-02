"""
Authentication Serializers

Serializers for login, token refresh, and user registration.
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from accounts.models import User


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Accepts username/email and password.
    """
    
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    def validate(self, data):
        """
        Authenticate user credentials.
        """
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            # Try to authenticate
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError(
                    'Invalid credentials. Please try again.'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is disabled.'
                )
            
            data['user'] = user
            return data
        else:
            raise serializers.ValidationError(
                'Must include "username" and "password".'
            )


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration (if needed in future).
    Currently not exposed via API - users are created through admin.
    """
    
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'phone_number',
            'role',
        ]
    
    def validate(self, data):
        """Ensure passwords match."""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return data
    
    def create(self, validated_data):
        """Create user with hashed password."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
