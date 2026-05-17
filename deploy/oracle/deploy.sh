#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/phuong-beauty}"
REPO_URL="${REPO_URL:-https://github.com/PhuocNguyen147/phuongphunxam.git}"
BRANCH="${BRANCH:-codex/admin-gallery-booking}"

if [ ! -d "$APP_DIR/.git" ]; then
  sudo mkdir -p "$APP_DIR"
  sudo chown -R "$USER:$USER" "$APP_DIR"
  git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
git fetch origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

if [ ! -f .env.production ]; then
  cp deploy/oracle/app.env.example .env.production
  echo "Da tao .env.production. Hay dien bien moi truong truoc khi chay lai script:"
  echo "nano $APP_DIR/.env.production"
  exit 1
fi

docker compose -f docker-compose.oracle.yml --env-file .env.production up -d --build
docker compose -f docker-compose.oracle.yml ps

echo "Kiem tra app:"
curl -fsS http://127.0.0.1:8787/api/health || true
echo
