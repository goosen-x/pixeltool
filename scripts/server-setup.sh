#!/bin/bash

# Скрипт для настройки сервера
# Запускать на сервере от имени admin

set -e  # Останавливаемся при ошибках

echo "🚀 Начинаем настройку сервера для pixeltool.pro"

# Создаем необходимые директории
echo "📁 Создаем структуру директорий..."
mkdir -p ~/apps/pixeltool
cd ~/apps/pixeltool

# Создаем файл окружения
echo "🔐 Создаем файл .env.production..."
cat > .env.production << 'EOF'
# Next.js
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://YOUR_SERVER_IP

# Supabase (скопируйте ваши значения)
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Analytics
NEXT_PUBLIC_YANDEX_METRIKA_ID=103754025

# Site URL (временно IP, потом домен)
NEXT_PUBLIC_SITE_URL=http://YOUR_SERVER_IP
EOF

echo "⚠️  Не забудьте отредактировать .env.production и добавить ваши значения!"

# Настраиваем Nginx
echo "🌐 Настраиваем Nginx..."
sudo cp /tmp/pixeltool.conf /etc/nginx/sites-available/pixeltool
sudo ln -sf /etc/nginx/sites-available/pixeltool /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Настраиваем Docker для работы с GitHub Container Registry
echo "🐳 Настраиваем Docker..."
echo "Для работы с GitHub Container Registry нужно создать Personal Access Token:"
echo "1. Перейдите на https://github.com/settings/tokens/new"
echo "2. Выберите права: read:packages"
echo "3. Создайте токен и выполните:"
echo "   docker login ghcr.io -u YOUR_GITHUB_USERNAME"

# Создаем systemd сервис для автозапуска
echo "🔧 Создаем systemd сервис..."
sudo tee /etc/systemd/system/pixeltool.service > /dev/null << 'EOF'
[Unit]
Description=Pixeltool Next.js Application
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin/apps/pixeltool
ExecStartPre=/usr/bin/docker pull ghcr.io/YOUR_GITHUB_USERNAME/pixeltool:main
ExecStart=/usr/bin/docker run --rm --name pixeltool -p 3000:3000 --env-file /home/admin/apps/pixeltool/.env.production ghcr.io/YOUR_GITHUB_USERNAME/pixeltool:main
ExecStop=/usr/bin/docker stop pixeltool
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Базовая настройка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Отредактируйте .env.production - добавьте ваши значения"
echo "2. Настройте GitHub Secrets в репозитории:"
echo "   - SERVER_HOST: IP вашего сервера"
echo "   - SERVER_USER: admin"
echo "   - SERVER_SSH_KEY: приватный SSH ключ"
echo "3. Замените YOUR_GITHUB_USERNAME в systemd сервисе"
echo "4. Запушьте код в репозиторий для автоматического деплоя"
echo ""
echo "🎯 После первого деплоя:"
echo "   sudo systemctl enable pixeltool"
echo "   sudo systemctl start pixeltool"