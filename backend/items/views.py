from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Item, Location, ChangeLog
from .serializers import ItemSerializer, LocationSerializer, ChangeLogSerializer


class LocationViewSet(viewsets.ModelViewSet):
    """
    CRUD dla lokalizacji.
    ModelViewSet automatycznie obsługuje: list, create, retrieve, update, destroy
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]  # tylko zalogowani


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.select_related('location').prefetch_related('changelog')
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    # Wyszukiwanie i filtrowanie
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'id', 'category', 'responsible_unit']
    ordering_fields = ['name', 'created_at', 'updated_at']

    def perform_update(self, serializer):
        """
        Nadpisujemy metodę zapisu — przed zapisem tworzymy wpis w ChangeLog.
        To się odpala automatycznie przy każdym PATCH/PUT.
        """
        item = self.get_object()
        old_location = str(item.location) if item.location else None

        updated_item = serializer.save()

        new_location = str(updated_item.location) if updated_item.location else None

        # Zapisz zmianę tylko jeśli lokalizacja faktycznie się zmieniła
        if old_location != new_location:
            ChangeLog.objects.create(
                item=updated_item,
                changed_by=self.request.user,
                old_location=old_location,
                new_location=new_location,
            )


class ChangeLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ReadOnly — historia zmian tylko do odczytu, nikt nie edytuje ręcznie
    """
    queryset = ChangeLog.objects.select_related('item', 'changed_by')
    serializer_class = ChangeLogSerializer
    permission_classes = [IsAuthenticated]