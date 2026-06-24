from rest_framework import serializers
from .models import Item, Location, ChangeLog


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'  # wszystkie pola modelu


class ChangeLogSerializer(serializers.ModelSerializer):
    # Zamiast ID użytkownika pokazujemy jego nazwę
    changed_by = serializers.StringRelatedField()

    class Meta:
        model = ChangeLog
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    # Zagnieżdżamy pełne dane lokalizacji (nie tylko ID)
    location = LocationSerializer(read_only=True)
    # ID lokalizacji do zapisu (przy tworzeniu/edycji)
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        source='location',
        write_only=True,
        required=False,
        allow_null=True
    )
    # Historia zmian zagnieżdżona w przedmiocie
    changelog = ChangeLogSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = '__all__'