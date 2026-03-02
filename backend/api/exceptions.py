"""
Standardized Exception Handlers

This module defines custom exception handlers that ensure all API errors
follow a consistent JSON format, making it easier for frontend developers
to parse and handle errors predictably.
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import APIException


class APIErrorResponse:
    """
    Standardized error response format for all API endpoints.
    
    Example:
    {
        "status": "error",
        "code": "VALIDATION_ERROR",
        "message": "One or more fields have validation errors",
        "errors": {
            "agreed_fee": ["Ensure this value is greater than or equal to 0."],
            "enrollment_date": ["This field may not be null."]
        }
    }
    """
    pass


def custom_exception_handler(exc, context):
    """
    Custom exception handler that formats all DRF exceptions
    into our standardized response format.
    
    Called automatically by DRF when an exception is raised.
    """
    from rest_framework.views import exception_handler
    
    # Call the default DRF exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Reformat the response to our standard structure
        custom_response_data = {
            'status': 'error',
            'code': exc.__class__.__name__,
            'message': str(exc.detail) if hasattr(exc, 'detail') else 'An error occurred',
        }
        
        # If there are validation errors, include them
        if isinstance(response.data, dict):
            # For field-level errors (ValidationError)
            if any(isinstance(v, list) for v in response.data.values()):
                custom_response_data['errors'] = response.data
            # For non-field errors (PermissionDenied, etc.)
            else:
                custom_response_data['message'] = str(response.data)
        elif isinstance(response.data, list):
            # For list-based errors
            custom_response_data['message'] = response.data[0] if response.data else str(exc)
        
        response.data = custom_response_data
    
    return response


class ValidationException(APIException):
    """
    Raised when request data fails validation.
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'VALIDATION_ERROR'
    default_detail = 'One or more fields have validation errors.'


class ResourceNotFoundException(APIException):
    """
    Raised when a requested resource doesn't exist.
    """
    status_code = status.HTTP_404_NOT_FOUND
    default_code = 'NOT_FOUND'
    default_detail = 'The requested resource was not found.'


class ConflictException(APIException):
    """
    Raised when a request conflicts with existing data.
    E.g., attempting to enroll a student twice in the same batch.
    """
    status_code = status.HTTP_409_CONFLICT
    default_code = 'CONFLICT'
    default_detail = 'The request conflicts with the current state of the server.'
