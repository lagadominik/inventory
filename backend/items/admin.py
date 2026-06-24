from django.contrib import admin
from .models import Item, Location, ChangeLog

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'exact_location']
    search_fields = ['name']

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'location', 'responsible_unit']
    search_fields = ['id', 'name', 'category']
    list_filter = ['category', 'location']

@admin.register(ChangeLog)
class ChangeLogAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'item', 'changed_by', 'old_location', 'new_location']
    readonly_fields = ['timestamp']  # timestamp ustawiany automatycznie, nie ręcznie