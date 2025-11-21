# ✅ Project Deployment Checklist

## 🚀 Version 1.0: Infrastructure & Foundation (Current Mission)

**Objective:** Establish server, secure backend, and deploy the main landing page.

### Phase 1: Infrastructure Setup

- [x] **Server Access:** Confirm SSH access to `159.223.207.34`.
- [x] **Folder Structure:** Create `wade-usa-monolith/` with `apps`, `backend`, `data`.
- [x] **Security:** Create `.env` with strong passwords.
- [x] **Docker Config:** Create `docker-compose.yml` (Caddy, Directus, Postgres).
- [x] **Routing:** Create `Caddyfile` for `admin.wade-usa.com`.
- [x] **Validation:** Verify Directus login works on public web.

### Phase 2: Main Frontend

- [x] **Init Main Site:** Create `apps/main-site` (React/Vite).
- [x] **Docker Setup:** Apply Standard `Dockerfile` & `vite.config.js`.
- [x] **Integration:** Connect `main-site` in `docker-compose.yml`.
- [x] **Verification:** Verify `wade-usa.com` loads React via HTTPS.

### Phase 3: Authentication

- [ ] **SDK:** Install `@directus/sdk` in `main-site`.
- [ ] **Client:** Build `src/lib/directus.js`.
- [ ] **Login UI:** Implement Login Screen & Token storage.
- [ ] **CORS:** Lock down Directus to only allow `wade-usa.com`.

## 🔮 Version 2.0: TOCK Widget Deployment

**Objective:** Deploy the TOCK widget application.

- [ ] **New App:** Initialize `apps/tock`.
- [ ] **Config:** Clone Docker/Vite configs from V1.
- [ ] **Routing:** Add `tock.wade-usa.com` to Caddy.
- [ ] **Deploy:** Zero-downtime update (`docker compose up -d`).

## 🔮 Version 3.0: Budget Application

**Objective:** Deploy the Budgeting Tool.

- [ ] **New App:** Initialize `apps/budget-app`.
- [ ] **Routing:** Add `budget.wade-usa.com` to Caddy.
- [ ] **Deploy:** Update stack.
