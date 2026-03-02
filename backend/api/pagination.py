"""
Standardized Pagination

All list endpoints should support cursor-based pagination for scalability.
This module defines a consistent pagination class that all endpoints use.
"""

from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard pagination for API list endpoints.
    
    Default: 20 items per page
    Max: 100 items per page
    Query parameter: ?page=2&page_size=50
    
    Response includes pagination metadata:
    {
        "count": 150,
        "next": "http://localhost:8000/api/v1/courses/?page=2",
        "previous": null,
        "results": [...]
    }
    """
    page_size = 20
    page_size_query_param = 'page_size'
    page_size_query_description = 'Number of results to return per page.'
    max_page_size = 100


class LargeResultsSetPagination(PageNumberPagination):
    """
    For endpoints that return large datasets (e.g., payment history).
    
    Default: 50 items per page
    Max: 200 items per page
    """
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200


class SmallResultsSetPagination(PageNumberPagination):
    """
    For endpoints that return small, focused datasets.
    
    Default: 10 items per page
    Max: 50 items per page
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50
