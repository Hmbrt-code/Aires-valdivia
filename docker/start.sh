#!/bin/sh
set -e

echo "Clearing cached bootstrap files..."
php artisan config:clear

echo "Linking storage..."
php artisan storage:link 2>/dev/null || true

echo "Running migrations..."
php artisan migrate --force

echo "Running seeders..."
php artisan db:seed --class=RolesAndPermissionsSeeder --force
php artisan db:seed --class=AdminUserSeeder --force
php artisan db:seed --class=VecinoSeeder --force

echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting FrankenPHP..."
exec frankenphp run --config /etc/caddy/Caddyfile --adapter caddyfile
