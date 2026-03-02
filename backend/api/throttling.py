"""
Rate Limiting and Throttling

This module defines throttle classes that protect the API from abuse.
Different user types and endpoints get different rate limits.
"""

from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class AnonSustainedThrottle(AnonRateThrottle):
    """
    Rate limit for anonymous (unauthenticated) users.
    20 requests per hour.
    """
    scope = 'anon_sustained'
    rate = '20/hour'


class UserSustainedThrottle(UserRateThrottle):
    """
    Standard rate limit for authenticated users.
    100 requests per hour.
    """
    scope = 'user_sustained'
    rate = '100/hour'


class UserBurstThrottle(UserRateThrottle):
    """
    Burst rate limit - allows short bursts of activity.
    20 requests per minute.
    """
    scope = 'user_burst'
    rate = '20/minute'


class FinanceThrottle(UserRateThrottle):
    """
    More conservative rate limit for finance operations.
    50 requests per hour (high-value operations).
    """
    scope = 'finance'
    rate = '50/hour'
