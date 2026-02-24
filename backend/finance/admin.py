import csv

from django.contrib import admin
from django.http import HttpResponse
from django.utils import timezone
from unfold.admin import ModelAdmin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(ModelAdmin): # Changed here
    list_display = (
        'enrollment',
        'amount',
        'method',
        'reference_number',
        'payment_date',
        'received_by',
    )
    list_filter = (
        'method',
        ('payment_date', admin.DateFieldListFilter),
    )
    search_fields = ('reference_number', 'enrollment__student__username', 'enrollment__student__first_name')
    autocomplete_fields = ('enrollment',)
    readonly_fields = ('payment_date', 'received_by')
    list_per_page = 25
    actions = ['export_payments_csv']

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.received_by = request.user
        super().save_model(request, obj, form, change)

    @admin.action(description="Export selected payments to CSV")
    def export_payments_csv(self, request, queryset):
        """
        Export the selected payments to a simple CSV file
        for offline reconciliation and reporting.
        """
        timestamp = timezone.now().strftime("%Y%m%d-%H%M%S")
        filename = f"payments-{timestamp}.csv"

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'

        writer = csv.writer(response)
        writer.writerow(
            [
                "Student",
                "Course code",
                "Batch",
                "Amount",
                "Method",
                "Reference",
                "Payment date",
                "Recorded by",
            ]
        )

        for payment in queryset.select_related(
            "enrollment",
            "enrollment__student",
            "enrollment__batch",
            "enrollment__batch__course",
            "received_by",
        ):
            enrollment = payment.enrollment
            student = enrollment.student
            batch = enrollment.batch
            course = batch.course

            writer.writerow(
                [
                    str(student),
                    course.code,
                    batch.name,
                    payment.amount,
                    payment.get_method_display(),
                    payment.reference_number,
                    payment.payment_date.isoformat(),
                    payment.received_by.get_full_name()
                    or payment.received_by.username,
                ]
            )

        return response
