from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Dodajemy nasze pola do widoku listy użytkowników
    list_display = ['username', 'discord_id', 'is_admin', 'is_staff']
    # Dodajemy nasze pola do formularza edycji
    fieldsets = UserAdmin.fieldsets + (
        ('Discord', {'fields': ('discord_id', 'avatar_url', 'is_admin')}),
    )