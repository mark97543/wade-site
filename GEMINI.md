- # 🤖 Project Context: Wade-USA Monolith

  ## 1. Architecture Overview

  - **Type:** Modular Monolith (Single Repo, Single Server).
  - **Infrastructure:** Docker Compose + Caddy Reverse Proxy.
  - **Database:** PostgreSQL (Shared by Directus).
  - **Backend:** Directus (Headless CMS & API).
  - **Frontend:** Multiple React + Vite apps served via subdomains.

  ## 2. Hosting Infrastructure (Digital Ocean)

  - **Domain:** `wade-usa.com`
  - **IP Address:** `159.223.207.34`
  - **Specs:** 2GB Memory / 25GB Disk
  - **OS:** Ubuntu 24.04 (LTS) x64

  ## 3. The Tech Stack

  | Service     | Tech       | Internal Port | External Domain       |
  | ----------- | ---------- | ------------- | --------------------- |
  | **Proxy**   | Caddy      | `80`/`443`    | `*.wade-usa.com`      |
  | **Backend** | Directus   | `8055`        | `admin.wade-usa.com`  |
  | **DB**      | PostgreSQL | `5432`        | (Internal Only)       |
  | **App 1**   | React/Vite | `5173`        | `wade-usa.com`        |
  | **App 2**   | React/Vite | `5173`        | `budget.wade-usa.com` |

  ## 4. Directory Structure

  ```
  ~/wade-usa-monolith/
  ├── docker-compose.yml       # Orchestrates all services
  ├── Caddyfile                # Routing logic (Doorman)
  ├── .env                     # Secrets (Gitignored)
  ├── notes/                   # 📝 Project documentation & changelogs
  ├── apps/                    # Frontend Applications
  │   ├── main-site/           # Main Portfolio
  │   └── [future-app]/        # New projects go here
  └── backend/                 # Directus
      ├── extensions/          # Custom Node.js logic
      └── uploads/             # Persistent storage
  ```

  ## 5. Golden Rules for AI Generation

  ### A. Frontend (Vite)

  **ALWAYS** use this `vite.config.js` network block for new apps to ensure Caddy connectivity:

  ```
  server: {
    host: '0.0.0.0',  // Listen on all interfaces
    port: 5173,       // Standard Docker port
    strictPort: true,
    hmr: {
      clientPort: 443 // Force WSS over HTTPS
    }
  }
  ```

  ### B. Docker Services

  **ALWAYS** mount `node_modules` to prevent overwriting container dependencies:

  ```
  volumes:
    - ./apps/my-app:/app
    - /app/node_modules
  ```

  ## 6. Common Commands

  - **Start/Update:** `docker compose up -d --build`
  - **Reload Caddy (Routing):** `docker compose restart caddy`
  - **Logs:** `docker compose logs -f [service_name]`
  - **Stop:** `docker compose down`

  ## 7. Special Instructions
    - This is a learning project so do not edit files unless I explicitly ask you to. 
