#!/usr/bin/env bash
set -euo pipefail

sudo apt update
sudo apt upgrade -y
sudo apt install -y ca-certificates curl git nginx certbot python3-certbot-nginx

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sudo sh
fi

sudo usermod -aG docker "$USER"
sudo systemctl enable --now docker
sudo systemctl enable --now nginx

echo "Da cai xong Docker, Git, Nginx va Certbot."
echo "Hay dang xuat SSH roi dang nhap lai de quyen docker co hieu luc."
