from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(ModelAdmin): # Changed here
    list_display = ('enrollment', 'amount', 'method', 'reference_number', 'payment_date', 'received_by')
    list_filter = ('method', 'payment_date')
    search_fields = ('reference_number', 'enrollment__student__username', 'enrollment__student__first_name')
    autocomplete_fields = ('enrollment',)
    readonly_fields = ('payment_date', 'received_by')

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.received_by = request.user
        super().save_model(request, obj, form, change)
