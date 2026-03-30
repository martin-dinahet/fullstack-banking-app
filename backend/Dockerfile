FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    git \
    bash \
    unzip \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    autoconf \
    g++ \
    make \
    zlib-dev \
    libxml2-dev \
    freetype-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    jpegoptim \
    pngquant \
    optipng \
    libwebp-dev

RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    zip \
    intl \
    mbstring \
    opcache \
    xml \
    bcmath \
    gd

RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

COPY . .

ARG APP_ENV=prod

ENV APP_ENV=prod

RUN composer install -vvv --no-dev --optimize-autoloader --ignore-platform-reqs

EXPOSE 9000

CMD ["php-fpm"]
