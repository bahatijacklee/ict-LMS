"""
Authentication API Views

Endpoints for JWT token generation and management.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from api.v1.auth.serializers import LoginSerializer
from api.authentication import CustomTokenObtainPairSerializer


class LoginView(APIView):
    """
    POST /api/v1/auth/login/
    
    Authenticate user and return JWT tokens.
    
    Request:
    {
        "username": "student@baptist.edu",
        "password": "securepassword"
    }
    
    Response:
    {
        "status": "success",
        "data": {
            "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
            "user": {
                "id": "uuid",
                "username": "student@baptist.edu",
                "email": "student@baptist.edu",
                "role": "STUDENT",
                "first_name": "John",
                "last_name": "Doe"
            }
        },
        "message": "Login successful"
    }
    """
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Authenticate and return JWT tokens."""
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens using our custom serializer
            token_serializer = CustomTokenObtainPairSerializer()
            token = token_serializer.get_token(user)
            
            return Response({
                'status': 'success',
                'data': {
                    'access': str(token.access_token),
                    'refresh': str(token),
                    'user': {
                        'id': str(user.id),
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                        'role_display': user.get_role_display(),
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    }
                },
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'status': 'error',
            'code': 'AUTHENTICATION_FAILED',
            'message': 'Login failed',
            'errors': serializer.errors
        }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """
    POST /api/v1/auth/logout/
    
    Blacklist the refresh token (logout user).
    
    Request:
    {
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Blacklist refresh token."""
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                
                return Response({
                    'status': 'success',
                    'message': 'Logout successful'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'code': 'INVALID_REQUEST',
                    'message': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'status': 'error',
                'code': 'LOGOUT_FAILED',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
