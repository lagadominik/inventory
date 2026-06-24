from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def me(request):
    """Zwraca dane zalogowanego użytkownika lub info że niezalogowany."""
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'username': request.user.username,
            'is_admin': request.user.is_admin,
            'avatar_url': request.user.avatar_url,
        })
    return Response({'authenticated': False})