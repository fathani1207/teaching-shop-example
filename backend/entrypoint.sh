#!/bin/sh
set -e

# Attendre que PostgreSQL soit prête (backup)
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL ready!"

# Migrations
uv run python manage.py migrate

# Serveur
exec uv run python manage.py runserver 0.0.0.0:8000
