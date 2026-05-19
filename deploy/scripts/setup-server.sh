#!/usr/bin/env bash
# =============================================================================
# Shirkat Gah — AWS EC2 Server Setup (Amazon Linux 2023)
# Run as root or with sudo: bash deploy/scripts/setup-server.sh
# =============================================================================
set -euo pipefail

echo "==> Shirkat Gah EC2 Server Setup"

# System updates
dnf update -y

# Node.js 20
if ! command -v node &>/dev/null; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  dnf install -y nodejs
fi

# pnpm
if ! command -v pnpm &>/dev/null; then
  npm install -g pnpm@9
fi

# PM2
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

# Nginx
dnf install -y nginx
systemctl enable nginx

# Redis (local or use ElastiCache — install for dev/single-box)
dnf install -y redis6 || dnf install -y redis || true
systemctl enable redis || systemctl enable redis6 || true
systemctl start redis || systemctl start redis6 || true

# PostgreSQL (local on EC2 — run setup-postgres.sh after install)
dnf install -y postgresql15-server postgresql15
postgresql-setup --initdb 2>/dev/null || true
systemctl enable postgresql
systemctl start postgresql

# Docker (optional — for containerized deploy)
dnf install -y docker
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user || true

# Log directories
mkdir -p /var/log/shirkat-gah
chown -R ec2-user:ec2-user /var/log/shirkat-gah

# App directory
APP_DIR="/opt/shirkat-gah"
mkdir -p "$APP_DIR"
chown -R ec2-user:ec2-user "$APP_DIR"

# Nginx config
if [ -f deploy/nginx/api.shirkatgah.org.conf ]; then
  cp deploy/nginx/api.shirkatgah.org.conf /etc/nginx/conf.d/api.shirkatgah.org.conf
  mkdir -p /etc/nginx/snippets
  cp deploy/nginx/snippets/proxy-params.conf /etc/nginx/snippets/proxy-params.conf
  nginx -t && systemctl reload nginx
fi

# Firewall
if command -v firewall-cmd &>/dev/null; then
  firewall-cmd --permanent --add-service=http
  firewall-cmd --permanent --add-service=https
  firewall-cmd --reload
fi

echo "==> Setup complete. Next steps:"
echo "  1. Clone repo to $APP_DIR"
echo "  2. sudo bash deploy/scripts/setup-postgres.sh"
echo "  3. Copy .env.production (DATABASE_URL=postgresql://postgres@localhost:5432/shirkat_gah?schema=public)"
echo "  4. bash deploy/scripts/reset-database.sh --yes"
echo "  5. bash deploy/scripts/deployment.sh"
