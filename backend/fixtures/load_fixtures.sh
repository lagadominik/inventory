#!/bin/bash
# Podmień placeholdery na prawdziwe wartości z ENV
sed "s/DISCORD_CLIENT_ID_PLACEHOLDER/$DISCORD_CLIENT_ID/g; s/DISCORD_CLIENT_SECRET_PLACEHOLDER/$DISCORD_CLIENT_SECRET/g" \
  /app/fixtures/socialapp.json > /tmp/socialapp_real.json

# Załaduj fixtures (--ignorenonexistent = nie błęduj jeśli już istnieją)
python manage.py loaddata /app/fixtures/site.json
python manage.py loaddata /tmp/socialapp_real.json

echo "Fixtures załadowane!"