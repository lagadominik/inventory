from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Rozszerzamy domyślny model użytkownika Django.
    AbstractUser daje nam już: username, email, password, is_staff, is_active itp.
    Dodajemy tylko to czego nam brakuje.
    """
    discord_id = models.CharField(
        max_length=64,
        unique=True,
        null=True,
        blank=True
    )
    avatar_url = models.URLField(
        null=True,
        blank=True
    )
    is_admin = models.BooleanField(
        default=False,
        help_text="Dostęp do panelu administracyjnego aplikacji"
    )

    def __str__(self):
        return f"{self.username} (Discord: {self.discord_id})"