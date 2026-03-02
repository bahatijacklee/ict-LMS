"""
API V1 URL Configuration

Aggregates all v1 API endpoints into a single versioned namespace.
All endpoints are prefixed with /api/v1/
"""

from django.urls import path, include

app_name = 'v1'

urlpatterns = [
    # Authentication: /api/v1/auth/
    path('auth/', include('api.v1.auth.urls')),
    
    # User accounts: /api/v1/accounts/
    path('accounts/', include('api.v1.accounts.urls')),
    
    # Courses and batches: /api/v1/courses/ and /api/v1/batches/
    path('', include('api.v1.courses.urls')),
    
    # Enrollments: /api/v1/enrollments/
    path('enrollments/', include('api.v1.enrollments.urls')),
    
    # Finance and payments: /api/v1/payments/
    path('payments/', include('api.v1.finance.urls')),
    
    # Statistics and dashboard: /api/v1/stats/
    path('stats/', include('api.v1.stats.urls')),
]
