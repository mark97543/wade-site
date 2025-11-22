# Initial Deployment Guide

This guide covers the steps to deploy the Wade-USA Monolith to a fresh Digital Ocean Droplet.

## Prerequisites
- Digital Ocean Account
- Domain Name (e.g., `wade-usa.com`) pointing to Digital Ocean nameservers or managed via A records.

## Step 1: Create Droplet
1.  Log in to Digital Ocean.
2.  Click **Create** -> **Droplets**.
3.  **Region**: Choose the closest region to your users (e.g., NYC1).
4.  **OS**: Ubuntu 24.04 (LTS) x64.
5.  **Droplet Type**: Basic (Regular SSD).
6.  **CPU Options**: Premium Intel or AMD (Recommended for better performance) or Regular.
    -   *Minimum Specs*: 2GB RAM / 1 CPU (Directus + Postgres + Node apps can be heavy).
7.  **Authentication**: **SSH Key** (Highly Recommended). Upload your public key.
8.  **Hostname**: `wade-usa-monolith` (or similar).
9.  Click **Create Droplet**.

## Step 2: DNS Configuration
1.  Copy the **IP Address** of your new Droplet.
2.  Go to your DNS provider (e.g., Namecheap, GoDaddy, or Digital Ocean Networking).
3.  Create **A Records**:
    -   `@` -> `YOUR_DROPLET_IP`
    -   `*` -> `YOUR_DROPLET_IP` (Wildcard for subdomains like `admin`, `budget`, etc.)

## Step 3: Server Setup
SSH into your server:
```bash
ssh root@YOUR_DROPLET_IP
```

### 3.1 Update System
```bash
apt update && apt upgrade -y
```

### 3.2 Install Docker & Docker Compose
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update

# Install Docker packages:
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

### 3.3 Install Git
```bash
apt install git -y
```

## Step 4: Project Setup

### 4.1 Clone Repository
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/wade-usa-monolith.git
cd wade-usa-monolith
```

### 4.2 Configure Environment Variables
Create the `.env` file:
```bash
nano .env
```
Paste your production secrets (ensure these match your local `.env` but with production values):
```ini
# Domains
ROOT_DOMAIN=wade-usa.com
ADMIN_DOMAIN=admin.wade-usa.com
ASSETS_DOMAIN=assets.wade-usa.com
BUDGET_DOMAIN=budget.wade-usa.com

# Postgres
POSTGRES_USER=directus
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD

# Directus
SECRET=YOUR_LONG_RANDOM_STRING
ADMIN_EMAIL=admin@wade-usa.com
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
AUTH_COOKIE_DOMAIN=.wade-usa.com

# Vite Apps
VITE_ASSETS_PROTOCOL=https
VITE_ASSETS_DOMAIN=assets.wade-usa.com
VITE_PENDING_USER=...
VITE_BASIC_USER=...
VITE_ADMIN_USER=...
```
*Press `Ctrl+X`, then `Y`, then `Enter` to save.*

### 4.3 Start Services
```bash
docker compose up -d --build
```

## Step 5: Verification
1.  Wait a few minutes for containers to start and Caddy to obtain SSL certificates.
2.  Visit `https://wade-usa.com` (Main Site).
3.  Visit `https://admin.wade-usa.com` (Directus).
