from django import template
from decimal import Decimal
from datetime import date

register = template.Library()


@register.filter
def format_ksh(value):
    """
    Format a decimal value as Kenyan Shillings.
    Usage: {{ amount|format_ksh }}
    Output: KES 1,234.50
    """
    if value is None:
        return "KES 0.00"
    
    try:
        amount = Decimal(str(value))
        # Format with 2 decimal places and thousands separator
        formatted = f"{amount:,.2f}"
        return f"KES {formatted}"
    except (ValueError, TypeError):
        return "KES 0.00"


@register.filter
def format_date_short(value):
    """
    Format a date object as "MMM dd, YYYY" (e.g., "Feb 25, 2026").
    Usage: {{ date_object|format_date_short }}
    Consistent date formatting across dashboard.
    """
    if value is None:
        return ""
    
    if isinstance(value, date):
        return value.strftime("%b %d, %Y")
    
    return str(value)
