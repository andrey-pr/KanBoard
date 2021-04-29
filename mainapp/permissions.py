from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsBoardOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.board.owner == request.user


class IsTaskColumnOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.column.board.owner == request.user
