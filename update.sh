#!/bin/bash

set -e

APP_DIR="/TagFrame"
VENV="$APP_DIR/venv/bin/activate"

cd $APP_DIR

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Activating venv ==="
source $VENV

echo "=== Installing dependencies (if changed) ==="
pip install -r requirements.txt

echo "=== Running migrations ==="
python manage.py migrate --noinput

echo "=== Collecting static files ==="
python manage.py collectstatic --noinput

echo "=== Restarting Gunicorn ==="
systemctl restart tagframe

echo "=== Done ==="
