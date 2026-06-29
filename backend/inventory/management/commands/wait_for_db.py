import time
from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError


class Command(BaseCommand):
    help = 'Czeka aż baza danych będzie dostępna'

    def handle(self, *args, **options):
        self.stdout.write('Czekam na bazę danych...')
        db_conn = None
        attempts = 0
        while not db_conn:
            try:
                db_conn = connections['default']
                db_conn.cursor()
            except OperationalError:
                attempts += 1
                self.stdout.write(f'Baza niedostępna, próba {attempts}...')
                time.sleep(1)
        self.stdout.write(self.style.SUCCESS('Baza danych gotowa!'))