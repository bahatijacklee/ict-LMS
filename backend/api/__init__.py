"""
API Layer - Decoupled REST API for Next.js and other clients.

This package provides a clean, versioned API that separates concerns from
the Django admin layer (Phase 1). It enforces JWT authentication, role-based
permission classes, and standardized response formats across all endpoints.

Key modules:
- authentication: Custom JWT token generation with user claims
- permissions: Role-based permission classes (IsStudent, IsFinanceOfficer, etc.)
- exceptions: Standardized error responses
- pagination: Consistent pagination across list endpoints
- renderers: Custom JSON response format
- throttling: Rate limiting configuration
"""
