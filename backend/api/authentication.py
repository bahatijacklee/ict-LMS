"""
Custom JWT Authentication Module

This module customizes djangorestframework-simplejwt to include additional
user claims in the JWT payload, making it easy for the frontend to determine
the user's role and permissions without making additional API calls.

Standard JWT claims (subject, issued_at, expiration) are automatically included.
"""

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends the default TokenObtainPairSerializer to include user role
    and other relevant claims in the JWT payload.
    """

    @classmethod
    def get_token(cls, user):
        """
        Customize the token payload to include user role and basic info.
        
        The token will include:
        - user_id: UUID of the user
        - username: Username/email
        - email: User's email address
        - role: User's role (STUDENT, INSTRUCTOR, FINANCE, IT_ADMIN, SUPER_ADMIN)
        - first_name: User's first name
        - last_name: User's last name
        - is_staff: Whether user is staff (Django admin access)
        
        This allows the Next.js frontend to determine permissions
        without decoding the token on the backend each time.
        """
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['is_staff'] = user.is_staff

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    API endpoint for obtaining JWT tokens.
    
    POST /api/v1/auth/login/
    {
        "username": "student@baptist.edu",
        "password": "securepassword"
    }
    
    Returns:
    {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
    """
    serializer_class = CustomTokenObtainPairSerializer
