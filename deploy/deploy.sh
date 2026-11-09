#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/portfolio"
cd "$APP_DIR"

echo "==> 1. Menarik pembaruan kode dari Git..."
git pull origin main

echo "==> 2. Menginstal dependensi..."
npm ci

echo "==> 3. Menyinkronkan skema Prisma ke PostgreSQL..."
npx prisma db push

echo "==> 4. Membangun bundel produksi Next.js..."
npm run build

echo "==> 5. Memuat ulang proses PM2 (portfolio di port 3002)..."
if pm2 describe portfolio > /dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

echo "==> Deploy selesai! Cek status dengan: pm2 status"

