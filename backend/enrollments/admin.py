from django.contrib import admin
from django.db.models import DecimalField, Sum
from django.db.models.functions import Coalesce
from unfold.admin import ModelAdmin
from .models import Enrollment

@admin.register(Enrollment)
class EnrollmentAdmin(ModelAdmin): # Changed here
    list_display = (
        'student',
        'batch',
        'status',
        'agreed_fee',
        'balance',
        'created_at',
    )
    list_filter = ('status', 'batch__course', 'is_active', 'created_at')
    search_fields = ('student__username', 'student__first_name', 'student__last_name', 'batch__name')
    autocomplete_fields = ('student', 'batch')
    list_per_page = 25

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('student', 'batch', 'batch__course').annotate(
            paid_amount=Coalesce(
                Sum('payments__amount'),
                0,
                output_field=DecimalField(max_digits=10, decimal_places=2),
            )
        )

    @admin.display(description="Balance")
    def balance(self, obj):
        paid = getattr(obj, 'paid_amount', 0)
        return obj.agreed_fee - paid
