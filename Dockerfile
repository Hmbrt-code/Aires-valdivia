FROM dunglas/frankenphp:latest-php8.3-alpine

# Install Node.js and build tools
RUN apk add --no-cache nodejs npm postgresql-client

# Install PHP extensions
RUN install-php-extensions \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    tokenizer \
    xml \
    ctype \
    fileinfo \
    bcmath \
    curl \
    openssl \
    zip \
    opcache \
    pcntl

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && npm ci \
    && npm run build \
    && rm -rf node_modules

RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && chmod -R 775 storage bootstrap/cache

COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
