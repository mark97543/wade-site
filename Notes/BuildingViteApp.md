# 🚀 Guide: Adding a New Vite App to the Monolith

This guide provides a complete walkthrough for creating, configuring, and deploying a new React + Vite application within the `wade-usa-monolith` project.

Follow these steps to ensure the new app integrates seamlessly with Docker and the Caddy reverse proxy.

---

## Step 1: Manually Create the Application Structure

Instead of using an automated tool, we will create each file manually to ensure a clean setup. Replace `my-new-app` with your actual app name in all file paths and content.

1.  Navigate to the project root:
    ```bash
    cd ~/wade-usa-monolith
    ```

2.  Create the necessary directories:
    ```bash
    mkdir -p apps/my-new-app/src
    ```

3.  **Create `apps/my-new-app/package.json`**
    This file defines your project's dependencies and scripts.

    #### 📋 Template: `package.json`
    ```json
    {
      "name": "my-new-app",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      "devDependencies": {
        "@vitejs/plugin-react": "^4.2.1",
        "vite": "^5.0.8"
      }
    }
    ```

4.  **Create `apps/my-new-app/index.html`**
    This is the main HTML file that Vite will use as an entry point.

    #### 📋 Template: `index.html`
    ```html
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My New App</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
      </body>
    </html>
    ```

5.  **Create `apps/my-new-app/src/main.jsx`**
    This JavaScript file is the entry point for your React application.

    #### 📋 Template: `src/main.jsx`
    ```javascript
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App.jsx'
    import './index.css'

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    ```

6.  **Create `apps/my-new-app/src/App.jsx`**
    This is your root React component.

    #### 📋 Template: `src/App.jsx`
    ```javascript
    function App() {
      return (
        <>
          <h1>Hello from My New App!</h1>
          <p>This is a manually created Vite + React application.</p>
        </>
      )
    }

    export default App
    ```

7.  **Create `apps/my-new-app/src/index.css`**
    A basic stylesheet for global styles.

    #### 📋 Template: `src/index.css`
    ```css
    body {
      font-family: sans-serif;
      background-color: #242424;
      color: rgba(255, 255, 255, 0.87);
      display: grid;
      place-content: center;
      min-height: 100vh;
      text-align: center;
    }
    ```

8.  **Install Dependencies**
    Now, navigate into the new app's directory and install the packages defined in `package.json`.
    ```bash
    cd apps/my-new-app
    npm install
    cd ../.. # Return to the project root
    ```

## Step 2: Create the Dockerfile

Every new application needs a `Dockerfile` to tell Docker how to build and run it.

**Action:** Create a new file at `apps/my-new-app/Dockerfile`.

#### 📋 Template: `Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

## Step 3: Configure Vite for Caddy & Docker

You must update the Vite configuration to allow it to communicate correctly from within its Docker container out through the Caddy reverse proxy. This is a **Golden Rule** for this project.

**Action:** Overwrite the contents of `apps/my-new-app/vite.config.js`.

#### 📋 Template: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces within the container
    port: 5173,       // The standard internal port for all our Vite apps
    strictPort: true,
    hmr: {
      clientPort: 443 // Route Hot Module Replacement traffic through Caddy's HTTPS port
    }
  }
})
```

## Step 4: Add the App to Docker Compose

Now, teach Docker Compose about your new service.

**Action:** Edit the main `docker-compose.yml` file and add a new service definition under the `services` section.

#### 📋 Template: `docker-compose.yml` snippet

```yaml
  # ... other services like main-site

  # App X: My New App
  my-new-app:
    build: ./apps/my-new-app
    container_name: my-new-app # Use a unique name
    restart: unless-stopped
    volumes:
      - ./apps/my-new-app:/app
      - /app/node_modules
    networks:
      - wade-network

networks:
# ...
```

## Step 5: Configure Public Routing

Finally, assign a domain to your new app and tell Caddy how to route traffic to it.

### A. Add a Domain in `.env`

**Action:** Edit the `.env` file and add a new variable for your app's domain.

#### 📋 Template: `.env` addition

```bash
# Add this to both the LOCAL DEV and PRODUCTION sections
MY_NEW_APP_DOMAIN=my-app.localhost

# For production:
# MY_NEW_APP_DOMAIN=my-app.wade-usa.com
```

### B. Add the Route to `Caddyfile`

**Action:** Edit the `Caddyfile` and add a new block to handle reverse proxying for your new domain.

#### 📋 Template: `Caddyfile` addition

```caddy
# ... other domain blocks

{$MY_NEW_APP_DOMAIN} {
    reverse_proxy my-new-app:5173
}
```

## Step 6: Launch!

With all the configuration in place, you can now build and run your new container.

1.  **Build and start all services:**
    ```bash
    docker compose up -d --build
    ```
2.  **Check the logs** to ensure it started correctly:
    ```bash
    docker compose logs -f my-new-app
    ```
3.  **Verify in Browser:** Open your browser and navigate to the domain you set in the `.env` file (e.g., `http://my-app.localhost` or `https://my-app.wade-usa.com`).