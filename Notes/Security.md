# Project Authentication with Directus and React

This document outlines a comprehensive strategy for implementing a secure and centralized authentication system for the Wade Site project. The backend is powered by Directus, and the frontend is built with React.

The primary goals are:
- Secure user login and session management.
- Role-based access control (RBAC) with `pending`, `basic`, and `admin` user levels.
- A centralized authentication system that works across all applications and subdomains.

## 1. Backend Setup: Directus

Before writing any frontend code, you need to configure Directus to support the authentication requirements.

### 1.1. User Roles

Directus has a powerful RBAC system. You need to create the following roles in the Directus Admin Panel (`Settings -> Roles & Permissions`):

1.  **Pending:** A default role for newly registered users. This role should have very limited or no permissions, preventing them from accessing any data until an admin approves them.
2.  **Basic:** The standard user role with access to the main features of the application.
3.  **Admin:** A role with extended privileges for managing users, content, and system settings.

### 1.2. Permissions

For each role, configure the permissions for your data collections. For example, the `Basic` role might have `read` access to most content, while the `Admin` role would have full `CRUD` (Create, Read, Update, Delete) permissions.

### 1.3. Cross-Domain Authentication (CORS and Cookies)

To enable authentication across different subdomains (e.g., `app1.wade-site.com` and `app2.wade-site.com`), you need to configure both CORS and the authentication cookie settings in your Directus environment configuration.

**CORS (Cross-Origin Resource Sharing):**
Set the `CORS_ORIGIN` environment variable to allow requests from all your subdomains. You can use a wildcard for development, but for production, it's better to be explicit.

```
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:5173,https://wade-site.com,https://app1.wade-site.com
```

**Auth Cookies:**
For seamless cross-subdomain authentication, using cookies is the best approach. Configure the Directus `AUTH_COOKIE_DOMAIN` to be your root domain. This allows the browser to send the authentication cookie with requests to any subdomain.

```
AUTH_MODE=cookie
AUTH_COOKIE_DOMAIN=.wade-site.com
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAME_SITE=lax
```

When using cookie-based authentication, Directus will automatically handle the access token by setting a secure, `HttpOnly` cookie. This is more secure than storing tokens in `localStorage`.

### 1.4. Where to Configure These Settings

The settings like `CORS_ORIGIN`, `AUTH_MODE`, and `AUTH_COOKIE_DOMAIN` are **environment variables** that Directus reads on startup. When running Directus with Docker, the most common place to set these is in your `docker-compose.yml` file, under the `environment` section for the Directus service.

Here is an example snippet of how it might look in your `docker-compose.yml`:

```yaml
services:
  directus:
    image: directus/directus:latest
    ports:
      - 8055:8055
    environment:
      # ... other variables like KEY, SECRET, DB_CLIENT etc.

      # --- AUTHENTICATION SETTINGS ---
      # CORS Configuration
      CORS_ENABLED: "true"
      CORS_ORIGIN: "http://localhost:5173,https://wade-site.com,https://app1.wade-site.com"

      # Cookie-based Authentication
      AUTH_MODE: "cookie"
      AUTH_COOKIE_DOMAIN: ".wade-site.com"
      AUTH_COOKIE_SECURE: "true"
      AUTH_COOKIE_SAME_SITE: "lax"
    # ... rest of the service definition
```

By placing these variables here, you are instructing your Directus container how to behave regarding cross-domain requests and authentication cookies.

## 2. Frontend Implementation

We will create a centralized authentication logic within a shared React context that can be used by any of the frontend applications.

### 2.1. A Note on Project Structure for Shared Auth

You raised a good point about the location of the authentication-related files. A clean approach is to create a dedicated package for handling authentication logic.

**Proposed Structure: `shared/auth`**

```
shared/
├── auth/
│   ├── package.json
│   ├── src/
│   │   ├── AuthContext.jsx
│   │   ├── directus.js
│   │   └── index.js  // (exports AuthContext, useAuth, etc.)
│   └── ...
└── shared-ui/
    └── ...
```

**Advantages of this structure:**

*   **Separation of Concerns:** It separates pure business logic (authentication) from UI components (`shared-ui`).
*   **Clarity:** It's more intuitive to find auth-related code in a dedicated `auth` package.

This guide will use the `shared/auth` path in its examples. You would then import from it in your apps like `import { useAuth } from '@wade/auth';` (after setting up the correct package name and workspace configuration).

### 2.2. Step 1: Create an `AuthContext`

An `AuthContext` will provide authentication status, user data, and login/logout functions to the entire application.

**File: `shared/auth/src/AuthContext.jsx`** (You'll need to create this new directory and file)

```jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { directus } from './directus'; // We will create this API client next

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, check if the user is already authenticated
    const fetchUser = async () => {
      try {
        // This will succeed if the auth cookie is present and valid
        const response = await directus.users.me.read();
        setUser(response);
      } catch (error) {
        // Not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    await directus.auth.login({ email, password });
    const response = await directus.users.me.read();
    setUser(response);
  };

  const logout = async () => {
    await directus.auth.logout();
    setUser(null);
  };

  const auth = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role?.name === 'Admin', // Example of role check
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={auth}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
```

### 2.3. Step 2: Create a Directus API Client

Create a file to initialize the Directus SDK.

**File: `shared/auth/src/directus.js`**

```javascript
import { createDirectus, rest, authentication } from '@directus/sdk';

// You'll need to install the SDK: npm install @directus/sdk
const directus = createDirectus('http://your-directus-url.com')
  .with(authentication('cookie'))
  .with(rest());

export { directus };
```

### 2.4. Step 3: Create a Centralized `ProtectedRoute` Component

To ensure all applications use the same logic for guarding routes, the `ProtectedRoute` component should be centralized in the `shared/shared-ui` package.

**File: `shared/shared-ui/src/ProtectedRoute/ProtectedRoute.jsx`** (You'll need to create this directory and file)

```jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@wade/auth'; // Assuming auth package is aliased as @wade/auth

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // If it's an admin route and the user is not an admin,
    // redirect to an "unauthorized" page or the home page.
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

### 2.5. Step 4: Packaging and Configuration

For the `ProtectedRoute` to be available to other apps, you need to update the package configurations.

#### `shared/shared-ui` Package

1.  **Add Peer Dependency:** The `ProtectedRoute` uses hooks from `react-router-dom`. Since the host application (`main-site`) will provide this package, you should declare it as a `peerDependency` in `shared/shared-ui/package.json`.

    **File: `shared/shared-ui/package.json`**
    ```json
    {
      "name": "@wade/ui",
      "version": "1.0.0",
      "private": true,
      "main": "index.jsx",
      "dependencies": {
        "react": "^18.2.0"
      },
      "peerDependencies": {
        "react-router-dom": "^6.0.0"
      }
    }
    ```

2.  **Export the Component:** Export `ProtectedRoute` from the main entry point of the `@wade/ui` package.

    **File: `shared/shared-ui/index.jsx`**
    ```jsx
    // Assuming you have other exports like Header
    // The exact paths depend on your file structure
    export * from './src/Header/Header'; 
    export * from './src/Button/Button';

    // Add the export for ProtectedRoute
    export { ProtectedRoute } from './src/ProtectedRoute/ProtectedRoute';
    ```

#### `apps/main-site` Package

The `package.json` for `main-site` should already include `react-router-dom`. The key change is updating the `import` statement in your application code to pull `ProtectedRoute` from the shared UI library.

#### `docker-compose.yml`

No changes are required here. The existing configuration for the `main-site` service already mounts the shared UI directory:

```yaml
# In your docker-compose.yml
services:
  main-site:
    # ...
    volumes:
      # ...
      # This line makes the shared UI code available inside the container
      - ./shared/shared-ui:/shared-ui 
```
This volume mount is crucial for development, as it ensures that changes in the `@wade/ui` package are immediately reflected in your running `main-site` application without needing to rebuild the Docker image.

### 2.6. Step 5: Update the Main Application

Now, you can use the centralized `ProtectedRoute` in any of your applications. The main change is to import it from the shared UI package.

**File: `apps/main-site/src/App.jsx`**

```jsx
import { Routes, Route } from 'react-router-dom';
// Import Header and ProtectedRoute from the shared UI package
import { Header, ProtectedRoute } from "@wade/ui"; 
import { Home } from "./pages/Home";
import { Login_Page } from "./pages/Login_Page";
import { Dashboard } from "./pages/Dashboard";
import { AdminPanel } from "./pages/AdminPanel"; // Example admin page
// The old local component is no longer needed
// import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login_Page />} />

        {/* Protected Routes for Basic Users */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Route for Admins Only */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />

        <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
      </Routes>
    </>
  )
}

export default App;
```

The remaining files like `main.jsx` and `Login_Page.jsx` do not need to be changed for this refactoring, as they rely on the `AuthContext`, not the `ProtectedRoute` component directly.