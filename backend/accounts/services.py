from .models import User


def get_recently_created_staff(limit: int = 5):
    """
    Return recently created staff/admin users.
    Useful for IT Admin to track new account creation.
    """
    return (
        User.objects.filter(is_staff=True)
        .order_by("-date_joined")[:limit]
    )
