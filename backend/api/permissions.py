"""
Role-Based Permission Classes

This module defines granular permission checks that protect API endpoints
based on user roles. The permission hierarchy ensures that:

1. Unauthenticated users cannot access protected endpoints
2. Users can only perform actions appropriate to their role
3. Students cannot access admin endpoints
4. Finance officers cannot manage academic data
5. IT admins have broader access but not finance data

The backend NEVER trusts the frontend to enforce permissions.
If a student tries to POST to a restricted endpoint, they get a 403 Forbidden.
"""

from rest_framework import permissions


class IsStudent(permissions.BasePermission):
    """
    Allows access only to users with the STUDENT role.
    """
    message = "You do not have permission to perform this action. Student role required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'STUDENT'
        )


class IsInstructor(permissions.BasePermission):
    """
    Allows access only to users with the INSTRUCTOR role.
    """
    message = "You do not have permission to perform this action. Instructor role required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'INSTRUCTOR'
        )


class IsFinanceOfficer(permissions.BasePermission):
    """
    Allows access only to users with the FINANCE role.
    """
    message = "You do not have permission to perform this action. Finance Officer role required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'FINANCE'
        )


class IsITAdmin(permissions.BasePermission):
    """
    Allows access only to users with IT_ADMIN or SUPER_ADMIN role.
    """
    message = "You do not have permission to perform this action. IT Admin role required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ['IT_ADMIN', 'SUPER_ADMIN']
        )


class IsSuperAdmin(permissions.BasePermission):
    """
    Allows access only to users with the SUPER_ADMIN role.
    """
    message = "You do not have permission to perform this action. Super Admin role required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'SUPER_ADMIN'
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allows full access to the owner of an object, read-only access to others.
    
    Used for endpoints like /api/v1/accounts/me/ where students should only
    be able to modify their own profile.
    """
    
    def has_object_permission(self, request, view, obj):
        # Allow read-only methods to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner of the object
        # For user objects, check if the requesting user is the object
        if hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class IsStudentOrReadOnly(permissions.BasePermission):
    """
    Allows students to view course data (read-only).
    Only instructors and admins can create/update/delete.
    """
    
    def has_permission(self, request, view):
        # Allow read-only access to authenticated students
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Write access only to instructors and admins
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.role in ['INSTRUCTOR', 'IT_ADMIN', 'SUPER_ADMIN']
