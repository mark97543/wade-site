# Update Deployment Guide

This guide explains how to update the Wade-USA Monolith on the production server.

## Standard Update Procedure

### 1. SSH into the Server
```bash
ssh root@wade-usa.com
```

### 2. Navigate to Project Directory
```bash
cd ~/wade-usa-monolith
```

### 3. Pull Latest Changes
```bash
git pull origin main
```

### 4. Rebuild and Restart Containers
This command will rebuild any images that have changed and restart the containers.
```bash
docker compose up -d --build
```

### 5. Cleanup (Optional)
Remove unused images to save disk space:
```bash
docker image prune -f
```

## Troubleshooting

### View Logs
If something isn't working, check the logs:
```bash
# All services
docker compose logs -f

# Specific service (e.g., caddy, directus, main-site)
docker compose logs -f caddy
```

### Restart Specific Service
```bash
docker compose restart directus
```

### Full Reset (If things are really stuck)
**Warning**: This stops all services briefly.
```bash
docker compose down
docker compose up -d --build
```
