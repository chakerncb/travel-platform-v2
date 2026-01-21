#!/bin/bash

# Start PHP-FPM
php-fpm -D

# Run Laravel optimizations
cd /var/www
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Nginx
nginx -g 'daemon off;'