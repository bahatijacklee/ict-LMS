"""
Account API Views

Endpoints for user profile management.
Users can view and update their own profile.
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from api.v1.accounts.serializers import (
    UserProfileSerializer,
    UserProfileUpdateSerializer,
)
from api.permissions import IsOwnerOrReadOnly


class CurrentUserProfileView(APIView):
    """
    GET /api/v1/accounts/me/
    Retrieve the current authenticated user's profile.
    
    PATCH /api/v1/accounts/me/
    Update the current user's profile (first_name, last_name, phone_number).
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Return current user's profile."""
        serializer = UserProfileSerializer(request.user)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def patch(self, request):
        """Update current user's profile."""
        serializer = UserProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            # Return updated profile
            profile_serializer = UserProfileSerializer(request.user)
            return Response({
                'status': 'success',
                'data': profile_serializer.data,
                'message': 'Profile updated successfully.'
            })
        
        return Response({
            'status': 'error',
            'code': 'VALIDATION_ERROR',
            'message': 'Profile update failed.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
