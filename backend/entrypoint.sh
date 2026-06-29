#!/bin/bash
set -e

echo "Czekam na bazę danych..."
python manage.py wait_for_db 2>/dev/null || sleep 3

echo "Wykonuję migracje..."
python manage.py migrate --noinput

echo "Ładuję fixtures..."
bash /app/fixtures/load_fixtures.sh

echo "Startuję Django..."
exec "$@"