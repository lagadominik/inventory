# Zaczynamy od oficjalnego obrazu Pythona (slim = mniejszy rozmiar)
FROM python:3.12-slim

# Ustaw folder roboczy wewnątrz kontenera
WORKDIR /app

# Najpierw kopiuj tylko requirements.txt (optymalizacja cache Dockera)
# Jeśli requirements.txt się nie zmienił, Docker nie reinstaluje paczek
COPY requirements.txt .

# Zainstaluj zależności Pythona
RUN pip install --no-cache-dir -r requirements.txt

# Dopiero teraz kopiuj resztę kodu
COPY . .

# Domyślna komenda (nadpisana przez docker-compose.yml)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
