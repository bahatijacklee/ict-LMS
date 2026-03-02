"""
Authentication URL Configuration
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api.v1.auth.views import LoginView, LogoutView

app_name = 'auth'

urlpatterns = [
    # JWT Authentication
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
