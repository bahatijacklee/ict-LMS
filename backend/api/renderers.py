"""
Custom Renderers

Standardizes JSON responses across all API endpoints.
All successful responses follow the format:

{
    "status": "success",
    "data": {...},
    "message": "Optional message"
}
"""

from rest_framework.renderers import JSONRenderer


class StandardJSONRenderer(JSONRenderer):
    """
    Wraps all API responses in a standardized envelope.
    """
    
    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        Wrap the response data in our standard format.
        """
        response = renderer_context.get('response') if renderer_context else None
        
        # Don't wrap error responses (already handled by exception handler)
        if response and response.status_code >= 400:
            return super().render(data, accepted_media_type, renderer_context)
        
        # For successful responses, wrap in our standard envelope
        if response and response.status_code < 400:
            # Handle pagination metadata
            if isinstance(data, dict) and 'results' in data:
                # This is a paginated response
                wrapped_data = {
                    'status': 'success',
                    'data': data['results'],
                    'meta': {
                        'pagination': {
                            'count': data.get('count'),
                            'next': data.get('next'),
                            'previous': data.get('previous'),
                        }
                    }
                }
            else:
                # Regular response
                wrapped_data = {
                    'status': 'success',
                    'data': data
                }
            
            return super().render(wrapped_data, accepted_media_type, renderer_context)
        
        return super().render(data, accepted_media_type, renderer_context)
