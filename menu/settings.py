"""
Django settings for menu project.
"""

from pathlib import Path

# BASE_DIR artık pathlib.Path nesnesi olarak tanımlandı
BASE_DIR = Path(__file__).resolve().parent.parent

# Güvenlik ve Debug Ayarları
SECRET_KEY = 'your-secret-key-here'  # Gerçek projede gizli tutun!
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Uygulama Tanımlamaları
INSTALLED_APPS = [
    # Django varsayılan uygulamaları
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Üçüncü parti uygulamalar
    'corsheaders',           # CORS desteği
    'django_filters',        # Filtreleme için
    'rest_framework',        # REST API desteği
    'channels',              # WebSocket desteği (Django Channels)

    # Proje uygulamaları
    'meals',                 # Yemeklerle ilgili işlemlerin bulunduğu uygulama
]

# Middleware Ayarları
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS middleware'ini en üste ekleyin!
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL Konfigürasyonu
ROOT_URLCONF = 'menu.urls'

# Template Ayarları
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Şablon dosyalarınızın bulunduğu dizin
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI ve ASGI Ayarları
WSGI_APPLICATION = 'menu.wsgi.application'
ASGI_APPLICATION = 'menu.asgi.application'

# Veritabanı Ayarları (PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'menu_db',
        'USER': 'postgres',
        'PASSWORD': '1963',
        'HOST': 'localhost',
        'PORT': '5433',
    }
}

# Django REST Framework Ayarları
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Geliştirme için tüm işlemlere izin verir
    ],
}

# CORS Ayarları (React ile entegrasyon için)
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
]

# Cache Ayarları (django-redis)
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Channels Ayarları (Redis)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('127.0.0.1', 6379)],
        },
    },
}

# Statik Dosyalar
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'


# CSRF ve Session Ayarları (React ile entegrasyon için)
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

# Diğer Ayarlar
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Media dosyaları için ayarlar
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
