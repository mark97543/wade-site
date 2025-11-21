1. 1. # 📋 Operation Cluster-Wade: Master Plan

      **Architecture:** Modular Monolith (Single Backend, Multiple Frontends) **Infrastructure:** Digital Ocean Droplet + Docker **Routing:** Caddy Reverse Proxy (Auto-SSL)

      ## 1. The "Monorepo" Directory Structure

      ```
      ~/wade-usa-monolith/
      ├── docker-compose.yml       # Orchestrates all containers
      ├── .env                     # Secrets & Domain Config (Gitignored)
      ├── Caddyfile                # Routing logic
      │
      ├── apps/                    # Frontend Applications
      │   ├── main-site/           # (React) wade-usa.com
      │   ├── budget-app/          # (React) budget.wade-usa.com
      │   └── shared-ui/           # (React Lib) Shared Header/Footer/Button
      │
      ├── shared/                  # Static Asset Depot
      │   └── css/                 # Global CSS (main.css)
      │
      ├── backend/                 # Directus Configuration
      │   ├── extensions/
      │   └── uploads/
      │
      └── data/                    # Database Persistence (Gitignored)
          └── postgres/
      ```

      ## 2. Configuration Files

      ### A. `.env` (The Control Center)

      *Toggle between Local and Prod here.*

      ```
      # --- SECRETS (Change for Prod) ---
      POSTGRES_USER=wade
      POSTGRES_PASSWORD=password123
      SECRET=long_random_string_replace_me
      ADMIN_EMAIL=admin@wade-usa.com
      ADMIN_PASSWORD=password123
      
      # --- DOMAINS (Toggle Commenting to Switch) ---
      
      # OPTION A: LOCAL DEV (Default)
      ROOT_DOMAIN=wade.localhost
      ADMIN_DOMAIN=admin.localhost
      BUDGET_DOMAIN=budget.localhost
      ASSETS_DOMAIN=assets.localhost
      
      # OPTION B: PRODUCTION (Digital Ocean)
      # ROOT_DOMAIN=wade-usa.com
      # ADMIN_DOMAIN=admin.wade-usa.com
      # BUDGET_DOMAIN=budget.wade-usa.com
      # ASSETS_DOMAIN=assets.wade-usa.com
      ```
   
      ### B. `docker-compose.yml`
   
      *Note the environment variables passed to Caddy.*
      ```yaml
      services:
        #--- 1. The Dorrman (Caddy)
        caddy:
          image: caddy:latest
          container_name: wade_usa_caddy
          restart: unless-stopped
          ports:
            - "80:80"
            - "443:443"
          environment:
            ROOT_DOMAIN: ${ROOT_DOMAIN}
            ADMIN_DOMAIN: ${ADMIN_DOMAIN}
            ASSETS_DOMAIN: ${ASSETS_DOMAIN}
            BUDGET_DOMAIN: ${BUDGET_DOMAIN}
          volumes:
            - ./Caddyfile:/etc/caddy/Caddyfile
            - ./shared:/data/shared           # <--- SUPPLY LINE (Static Assets)
            - caddy_data:/data
            - caddy_config:/config
          networks:
            - wade-network
        #--- 2. The Backend (Directus)
        directus:
          image: directus/directus:latest
          container_name: wade_usa_directus
          restart: unless-stopped
          ports:
            - "8055:8055"
          volumes:
            - ./backend/uploads:/directus/uploads
            - ./backend/extensions:/directus/extensions
          environment:
            KEY: "${SECRET}"
            SECRET: "${SECRET}"
            ADMIN_EMAIL: "${ADMIN_EMAIL}"
            ADMIN_PASSWORD: "${ADMIN_PASSWORD}"
            DB_CLIENT: "pg"
            DB_HOST: "postgres"
            DB_PORT: "5432"
            DB_DATABASE: "directus"
            DB_USER: "${POSTGRES_USER}"
            DB_PASSWORD: "${POSTGRES_PASSWORD}"
            WEBSOCKETS_ENABLED: "true"
            CORS_ENABLED: "true"
            # Add Domains as needed 
            CORS_ORIGIN: "https://${ROOT_DOMAIN}, https://${ADMIN_DOMAIN}" 
          depends_on:
            - postgres
          networks:
            - wade-network
        #--- 3. The Database (Postgres)
        postgres:
          image: postgres:16-alpine
          container_name: wade_usa_postgres
          restart: unless-stopped
          volumes:
            - postgres_data:/var/lib/postgresql
          environment:
            POSTGRES_USER: "${POSTGRES_USER}"
            POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
            POSTGRES_DB: directus
          networks:
            - wade-network
        #--- 4. Fronend Apps
        # Main Site
        main-site:
          build: ./apps/main-site
          container_name: main-site
          restart: unless-stopped
          volumes:
            - ./apps/main-site:/app
            - /app/node_modules
            # Sync Shared UI for live editing
            - ./apps/shared-ui:/apps/shared-ui 
          networks:
            - wade-network
      networks:
        wade-network:
          driver: bridge
      
      volumes:
        caddy_data:
        caddy_config:
        postgres_data:
      ```
   
      ### C. `Caddyfile` (Dynamic)
   
      *Uses variables from `.env` so you never have to edit this file.*
   
      ```
      # Global Options
      {
          # Uncomment for testing to avoid rate limits
          # acme_ca [https://acme-staging-v02.api.letsencrypt.org/directory](https://acme-staging-v02.api.letsencrypt.org/directory)
      }
      
      # 1. Static Asset Depot
      {$ASSETS_DOMAIN} {
          root * /data/shared
          file_server
          header Access-Control-Allow-Origin "*"
      }
      
      # 2. Main Website
      {$ROOT_DOMAIN} {
          reverse_proxy main-site:5173
      }
      
      # 3. Budget Application
      {$BUDGET_DOMAIN} {
          reverse_proxy budget-app:5173
      }
      
      # 4. Backend Admin Panel
      {$ADMIN_DOMAIN} {
          reverse_proxy directus:8055
      }
      ```
   
      ## 3. Shared Resources Setup
   
      ### A. Static Assets
   
      - **Usage:** Add `<link rel="stylesheet" href="https://assets.wade-usa.com/css/main.css">` to `index.html`.
   
      ### B. Shared UI Library
   
      - **Usage:** In `package.json`, add `"@wade/ui": "file:../shared-ui"`.
      - **Import:** `import { Header } from '@wade/ui'`.
   
      ## 4. Standard React Template
   
      ### A. Dockerfile
   
      *Place in: `apps/<project-name>/Dockerfile`*
   
      ```
      FROM node:20-alpine
      WORKDIR /app
      COPY package.json package-lock.json ./
      RUN npm install
      COPY . .
      EXPOSE 5173
      CMD ["npm", "run", "dev", "--", "--host"]
      ```
   
      ### B. vite.config.js
   
      *Place in: `apps/<project-name>/vite.config.js`*
   
      ```
      import { defineConfig } from 'vite'
      import react from '@vitejs/plugin-react'
      
      export default defineConfig({
        plugins: [react()],
        server: {
          host: '0.0.0.0',
          port: 5173,
          strictPort: true,
          hmr: {
            clientPort: 443
          }
        }
      })
      ```
   
