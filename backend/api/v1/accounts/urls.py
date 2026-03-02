"""
Accounts URL Configuration
"""

from django.urls import path
from api.v1.accounts.views import CurrentUserProfileView

app_name = 'accounts'

urlpatterns = [
    # Current user profile
    path('me/', CurrentUserProfileView.as_view(), name='user-profile'),
]
