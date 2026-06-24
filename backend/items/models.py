from django.db import models
from users.models import User


class Location(models.Model):
    """
    Pomieszczenie lub miejsce gdzie mogą znajdować się przedmioty.
    Przykład: name="ProtoLab1", exact_location="szafka_A3"
    """
    name = models.CharField(max_length=128)
    exact_location = models.CharField(
        max_length=256,
        null=True,
        blank=True,
        help_text="Opcjonalne dokładne miejsce, np. szafka_A3, półka_2"
    )

    def __str__(self):
        if self.exact_location:
            return f"{self.name} / {self.exact_location}"
        return self.name

    class Meta:
        ordering = ['name']


class Item(models.Model):
    """
    Przedmiot/narzędzie śledzone w systemie.
    """
    # ID może być wpisane ręcznie lub z kodu QR/barcode
    id = models.CharField(
        max_length=64,
        primary_key=True,
        help_text="Unikalny identyfikator, np. TOOL-0042 lub numer z kodu kreskowego"
    )
    name = models.CharField(max_length=256)
    category = models.CharField(max_length=128)
    description = models.TextField(null=True, blank=True)
    responsible_unit = models.CharField(
        max_length=128,
        null=True,
        blank=True,
        help_text="Sekcja lub osoba odpowiedzialna za przedmiot"
    )
    photo_url = models.URLField(null=True, blank=True)
    location = models.ForeignKey(
        Location,
        on_delete=models.SET_NULL,  # jeśli lokalizacja usunięta, item zostaje z null
        null=True,
        blank=True,
        related_name='items'
    )
    home_location = models.ForeignKey(
    Location,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='home_items',
    help_text="Domyślna lokalizacja do której przedmiot powinien wracać"
)
    created_at = models.DateTimeField(auto_now_add=True)  # ustawiane automatycznie przy tworzeniu
    updated_at = models.DateTimeField(auto_now=True)      # aktualizowane automatycznie przy każdej zmianie

    def __str__(self):
        return f"[{self.id}] {self.name}"

    class Meta:
        ordering = ['name']


class ChangeLog(models.Model):
    """
    Historia każdej zmiany lokalizacji przedmiotu.
    Tworzona automatycznie przy każdej edycji.
    """
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,  # jeśli item usunięty, usuń też jego historię
        related_name='changelog'
    )
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='changes'
    )
    old_location = models.CharField(max_length=256, null=True, blank=True)
    new_location = models.CharField(max_length=256, null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp:%Y-%m-%d %H:%M} | {self.item} | {self.changed_by}"

    class Meta:
        ordering = ['-timestamp']  # najnowsze pierwsze