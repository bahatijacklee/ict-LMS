from django import template
from decimal import Decimal

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
