"""
Statistics and Dashboard URL Configuration
"""

from django.urls import path
from api.v1.stats.views import DashboardView

app_name = 'stats'

urlpatterns = [
    # Role-aware dashboard
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
