"""
Finance and Payments URL Configuration
"""

from django.urls import path
from api.v1.finance.views import (
    PaymentListView,
    PaymentDetailView,
    PaymentCreateView,
    MyPaymentsView,
    PaymentSummaryView,
)

app_name = 'finance'

urlpatterns = [
    # Student's own payments
    path('me/', MyPaymentsView.as_view(), name='my-payments'),
    
    # Finance officer payment management
    path('', PaymentListView.as_view(), name='payment-list'),
    path('create/', PaymentCreateView.as_view(), name='payment-create'),
    path('summary/', PaymentSummaryView.as_view(), name='payment-summary'),
    path('<uuid:id>/', PaymentDetailView.as_view(), name='payment-detail'),
]
