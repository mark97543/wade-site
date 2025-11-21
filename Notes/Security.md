# Website Security Guide

This guide provides a comprehensive overview of security best practices for building and maintaining a secure website. It covers topics from secure routing to mitigating common vulnerabilities.

## 1. Secure Routing

Secure routing is fundamental to protecting your website's resources and data. It ensures that only authenticated and authorized users can access specific parts of your application.

### 1.1. Authentication vs. Authorization

*   **Authentication** is the process of verifying a user's identity. This is typically done through login forms, where a user provides credentials (e.g., username and password, or a token).
*   **Authorization** is the process of determining whether an authenticated user has permission to access a specific resource or perform a certain action.

### 1.2. Protecting Routes

Protected routes are routes that require a user to be authenticated and, in some cases, authorized to view.

**Example (React Router):**

```jsx
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { isAuthenticated } from './auth'; // Your authentication logic

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}
```

### 1.3. Role-Based Access Control (RBAC)

RBAC restricts network access based on a person's role within an organization.

**Example (Conceptual):**

```javascript
// auth.js
const user = {
  username: 'jane_doe',
  role: 'admin' // or 'editor', 'viewer'
};

export const hasRole = (allowedRoles) => {
  return allowedRoles.includes(user.role);
};

// In your component or route guard
if (hasRole(['admin'])) {
  // Allow access to admin-only features
}
```

### 1.4. Example: Auth Context and Protected Routes in React

A common and effective pattern in modern React applications is to use a combination of React Context for state management and a wrapper component for protecting routes.

#### 1. Create an Auth Context

First, create a context to hold the authentication state and make it available throughout your app.

**`src/contexts/AuthContext.jsx`**
```jsx
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Could be an object with user details

  // In a real app, you'd have logic to check for a token in localStorage
  // and make an API call to verify it.

  const login = (userData) => {
    // In a real app, this would be the response from your API
    setUser(userData);
  };

  const logout = () => {
    // Clear user from state and remove token from localStorage
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
```

#### 2. Create a Protected Route Component

This component will check for the authentication status from the `AuthContext`. If the user is not authenticated, it redirects them to the login page.

**`src/components/ProtectedRoute.jsx`**
```jsx
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
```

#### 3. Use the AuthProvider and ProtectedRoute

Finally, wrap your application with the `AuthProvider` and use the `ProtectedRoute` for routes that require authentication.

**`src/App.jsx`**
```jsx
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          
          {/* Protected Route */}
          <ProtectedRoute path="/dashboard" component={Dashboard} />

        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

This approach provides a clean, reusable, and scalable way to handle authentication and route protection in your application.

### 1.5. Integrating with a Backend (e.g., Directus) and Handling Cookies

The React example above is purely a frontend pattern. To make it functional, it must interact with a backend service that manages user data and sessions. Here’s how it connects with a backend like Directus and how cookies play a crucial, secure role.

**The Role of the Backend and `httpOnly` Cookies**

The frontend **should not** store authentication tokens in `localStorage` if possible, as this makes them vulnerable to XSS attacks. The most secure method is for the backend to set an `httpOnly` cookie.

*   **`httpOnly` Cookie:** This is a special type of cookie that cannot be accessed by client-side JavaScript. This restriction mitigates the risk of a cross-site scripting (XSS) attack stealing the session token.
*   **The Flow:**
    1.  **Login Request:** Your React app's `login` function sends the user's credentials (email/password) to the backend's API endpoint (e.g., `POST /auth/login` in Directus).
    2.  **Backend Validation:** The backend validates the credentials.
    3.  **Set Cookie:** Upon success, the backend creates a session and sends a `Set-Cookie` header in the response. This header includes the session token and is marked as `httpOnly`, `Secure` (to ensure it's only sent over HTTPS), and `SameSite=Strict` (to protect against CSRF).
    4.  **Browser Storage:** The browser automatically receives and stores this cookie.
    5.  **Automatic Authentication:** For every subsequent request your app makes to the same domain, the browser automatically includes the cookie in the request headers. The backend uses this cookie to identify the user and validate their session.

#### 1.5.1. Handling Authentication Across Subdomains

If you are running multiple applications on different subdomains of a single parent domain (e.g., `app1.wade-usa.com`, `app2.wade-usa.com`), you can enable a shared login experience (Single Sign-On) by having the backend set the authentication cookie on the parent domain.

This is achieved by adding a `Domain` attribute to the `Set-Cookie` header. This tells the browser to send the cookie to any subdomain of the specified domain.

**Example `Set-Cookie` Header for Subdomains:**
`Set-Cookie: session_token=...; Domain=.wade-usa.com; HttpOnly; Secure; SameSite=Lax`

*   **`Domain=.wade-usa.com`**: This is the crucial part. The leading dot (`.`) makes the cookie available to `wade-usa.com` and all its subdomains.
*   **`SameSite=Lax`**: For cross-subdomain cookies, `SameSite=Lax` is often a better choice than `Strict` as it allows the cookie to be sent during top-level navigation, which is common in SSO flows.

This is a backend configuration task. You will need to configure your authentication service (e.g., in your Directus environment variables) to set the cookie domain to `.wade-usa.com`. With this in place, a user can log in once on any subdomain and remain authenticated across all other applications on the same parent domain.

**Example: Modifying `AuthContext` for Directus**

Here is how you would adapt the `login` and `logout` functions in the `AuthContext` to work with a Directus backend.

```jsx
// src/contexts/AuthContext.jsx (Modified)
import React, { createContext, useState, useContext, useEffect } from 'react';
import { directus } from '../services/directus'; // Your configured Directus SDK instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check for an existing session when the app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // The SDK automatically uses the httpOnly cookie
        const user = await directus.users.me.read();
        setUser(user);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // The SDK handles the API call and the browser stores the httpOnly cookie
    await directus.auth.login({ email, password });
    // After login, fetch the user's data
    const user = await directus.users.me.read();
    setUser(user);
  };

  const logout = async () => {
    // The SDK tells Directus to invalidate the session/token
    await directus.auth.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
```

In this more realistic example:
*   The `login` function calls the Directus SDK, which sends credentials to the backend. The backend responds by setting the secure `httpOnly` cookie.
*   The `logout` function tells Directus to end the session.
*   An `useEffect` hook runs on app startup to call the `/users/me` endpoint. If the request succeeds (because the browser sent a valid session cookie), the user's data is loaded into the state, establishing the session on the frontend. If it fails, the user is considered logged out.

### 1.6. User Levels (Roles)

For more granular control, you can define different user levels or roles. This allows you to show or hide certain UI elements or restrict access to specific API routes based on the user's role.

Here are three common user levels:

*   **`pending`**: This is for users who have signed up but have not yet been approved or have not completed a necessary step (like email verification).
    *   **Permissions**: Very limited. They might only be able to see a "Pending Approval" page or resend a verification email. They cannot access any protected content.
    *   **Use Case**: Useful for applications that require manual admin approval for new users.

*   **`basic`**: This is the standard user role after approval or verification.
    *   **Permissions**: Can access general protected content, view their profile, and use the main features of the application. They cannot access administrative features.
    *   **Use Case**: The default role for most authenticated users.

*   **`admin`**: This is a privileged role for administrators of the site.
    *   **Permissions**: Full access to all features, including user management (approving/deleting users), content management, and site settings.
    *   **Use Case**: For site owners and trusted personnel who manage the application.

You can extend the `ProtectedRoute` component or create a new `AdminRoute` component to handle these roles.

**Example: Role-based Protected Route**
```jsx
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          return <Redirect to="/login" />;
        }
        if (!roles.includes(user.role)) {
          // Redirect to an unauthorized page or home page
          return <Redirect to="/unauthorized" />; 
        }
        return <Component {...props} />;
      }}
    />
  );
};

// Usage in App.jsx
<RoleProtectedRoute path="/admin" component={AdminDashboard} roles={['admin']} />
<RoleProtectedRoute path="/dashboard" component={Dashboard} roles={['basic', 'admin']} />
```

## 2. Common Web Vulnerabilities & Mitigations

### 2.1. Cross-Site Scripting (XSS)

XSS attacks inject malicious scripts into trusted websites.

*   **Mitigation:**
    *   **Output Encoding:** Encode user-generated content on the server-side before rendering it in the browser. Libraries like `he` (for Node.js) or frameworks' built-in templating engines (e.g., Jinja, Blade) often do this automatically.
    *   **Content Security Policy (CSP):** See section 6.1.
    *   **Use modern frontend frameworks:** Frameworks like React, Vue, and Angular automatically sanitize and encode data, reducing the risk of XSS.

### 2.2. SQL Injection

SQL Injection attacks use malicious SQL queries to interfere with an application's database.

*   **Mitigation:**
    *   **Use Prepared Statements (Parameterized Queries):** This is the most effective way to prevent SQL injection.
    *   **Use an ORM/ODM:** Object-Relational Mappers (e.g., Sequelize, TypeORM) or Object-Data Mappers (e.g., Mongoose) typically use prepared statements by default.

**Bad (vulnerable):**
`const query = "SELECT * FROM users WHERE username = '" + username + "'";`

**Good (secure):**
`db.query('SELECT * FROM users WHERE username = ?', [username], ...);`

### 2.3. Cross-Site Request Forgery (CSRF)

CSRF tricks a victim into submitting a malicious request.

*   **Mitigation:**
    *   **Anti-CSRF Tokens:** Generate a unique, unpredictable token for each user session and require it for any state-changing request (e.g., POST, PUT, DELETE).
    *   **SameSite Cookies:** Set the `SameSite` attribute on your session cookies to `Strict` or `Lax`.

### 2.4. Security Misconfiguration

This is a broad category that includes insecure default configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.

*   **Mitigation:**
    *   Follow a hardening guide for your specific stack (OS, web server, database, framework).
    *   Disable or remove unnecessary features.
    *   Configure security headers (see section 5.2).
    *   Implement custom error pages that don't leak sensitive information.

## 3. Data Protection

### 3.1. Encryption in Transit (HTTPS/TLS)

Always use HTTPS to encrypt data between the client and the server.

*   **Implementation:**
    *   Obtain an SSL/TLS certificate from a Certificate Authority (CA) like Let's Encrypt (which is free).
    *   Configure your web server (e.g., Nginx, Apache, Caddy) to use the certificate and force HTTPS.

### 3.2. Encryption at Rest

Protect sensitive data stored in your database or on disk.

*   **Implementation:**
    *   Use database-level encryption features (e.g., PostgreSQL's `pgcrypto`, MySQL's Transparent Data Encryption).
    *   Encrypt sensitive files on the filesystem.

### 3.3. Password Hashing

Never store passwords in plain text.

*   **Implementation:**
    *   Use a strong, slow, and salted hashing algorithm like **Argon2** (preferred), **scrypt**, or **bcrypt**.
    *   Do NOT use fast hashing algorithms like MD5 or SHA-1.

## 4. Server-Side Security

### 4.1. Input Validation

Validate all data coming from the client-side.

*   **Best Practices:**
    *   Validate for type, length, format, and range.
    *   Use a well-vetted validation library (e.g., `express-validator` for Express, `zod`, `joi`).
    *   Implement validation on the server-side, even if you also have it on the client-side.

### 4.2. Security Headers

Configure HTTP response headers to enhance security.

*   **Important Headers:**
    *   `Strict-Transport-Security`: Forces browsers to use HTTPS.
    *   `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing.
    *   `X-Frame-Options: DENY` or `SAMEORIGIN`: Protects against clickjacking.
    *   `Content-Security-Policy`: See section 6.1.

### 4.3. Dependency Management

Keep all your libraries, frameworks, and other dependencies up-to-date.

*   **Best Practices:**
    *   Use tools like `npm audit`, `yarn audit`, or GitHub's Dependabot to scan for vulnerabilities.
    *   Regularly apply security patches.

## 5. Frontend Security

### 5.1. Content Security Policy (CSP)

CSP is an added layer of security that helps to detect and mitigate certain types of attacks, including XSS and data injection.

*   **Implementation:**
    *   Define a `Content-Security-Policy` HTTP header that specifies which sources of content are allowed to be loaded.

**Example (restrictive):**
`Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self'; style-src 'self';`

## 6. Best Practices

*   **Principle of Least Privilege:** Give users and system components the minimum level of access required to perform their functions.
*   **Secure Development Lifecycle (SDL):** Integrate security practices into every phase of the development process.
*   **Logging and Monitoring:** Log security-relevant events and monitor logs for suspicious activity.
*   **Regular Security Audits:** Conduct regular penetration testing and vulnerability scanning.

### WADE-USA Implementation

This section provides a detailed, step-by-step guide for implementing a centralized authentication system for `wade-usa.com` and its subdomains (e.g., `app1.wade-usa.com`, `shop.wade-usa.com`). This Single Sign-On (SSO) approach ensures a seamless and secure user experience across all related web applications.

#### 1. Conceptual Architecture

The system will consist of several key components, all managed within a single project structure and orchestrated with Docker.

```
+-------------------------------------------------------------------+
|                                                                   |
| Caddy Reverse Proxy (Handles HTTPS & Routing)                     |
|                                                                   |
|   +----------------------+      +---------------------------+     |
|   | wade-usa.com         |      | auth.wade-usa.com         |     |
|   +-------+--------------+      +------------+--------------+     |
|           |                           |                           |
|   +-------v--------------+      +------------v--------------+     |
|   | Main Site Docker     |      | Auth Service Docker       |     |
|   | (React/Vite App)     |      | (Node.js/Express API)     |     |
|   +----------------------+      +---------------------------+     |
|                                                                   |
|   +----------------------+      +---------------------------+     |
|   | app1.wade-usa.com    |      | Database (PostgreSQL)     |     |
|   +-------+--------------+      +------------+--------------+     |
|           |                           |                           |
|   +-------v--------------+      ^------------+                    |
|   | App1 Docker          |      |                                 |
|   | (React/Vite App)     |      | (Auth Service uses this DB)     |
|   +----------------------+      +---------------------------+     |
|                                                                   |
+-------------------------------------------------------------------+
```

#### 2. The Authentication Flow (SSO)

Here is the step-by-step process for a user authenticating across subdomains:

1.  **Accessing a Protected Page:** A user navigates to a protected resource, for example, `https://app1.wade-usa.com/dashboard`.
2.  **Frontend Check:** The React application on `app1` checks for an authentication context or a valid session. Finding none, it proceeds to the next step.
3.  **Redirection to Auth Service:** The `app1` frontend redirects the browser to the central authentication service. It includes a `redirect_uri` so the auth service knows where to send the user back.
    -   `https://auth.wade-usa.com/login?redirect_uri=https://app1.wade-usa.com/dashboard`
4.  **User Login:** The user sees the login page served by `auth.wade-usa.com` and enters their credentials.
5.  **Credential Validation:** The authentication service validates the credentials against its user database.
6.  **Cookie Issuance:** Upon success, the auth service sets a secure, `HttpOnly` cookie in the user's browser. **This is the most critical step for SSO.** The cookie must be configured correctly:
    -   **`Domain=.wade-usa.com`**: This makes the cookie available to the parent domain and all its subdomains.
    -   **`HttpOnly`**: Prevents JavaScript from accessing the cookie, mitigating XSS risks.
    -   **`Secure`**: Ensures the cookie is only sent over HTTPS.
    -   **`SameSite=Lax`**: A good balance for security and usability in an SSO flow.
7.  **Redirection Back to App:** The auth service redirects the user back to the `redirect_uri`.
    -   `https://app1.wade-usa.com/dashboard`
8.  **Authenticated State:** The `app1` frontend now loads. When it makes an API call to its own backend (e.g., `api.app1.wade-usa.com`), the browser automatically attaches the shared cookie. The backend validates the token in the cookie and confirms the user is authenticated.
9.  **Seamless Subdomain Access:** If the user now navigates to `https://shop.wade-usa.com`, that application will also have access to the cookie, and the user will already be logged in.

#### 3. Caddyfile Configuration

Caddy is an excellent choice for a reverse proxy because it automatically handles HTTPS for all your services. Your `Caddyfile` at the root of the project would look something like this:

```caddy
# Main Domain and Subdomains
wade-usa.com {
    reverse_proxy main-site:80
}

auth.wade-usa.com {
    reverse_proxy auth-service:3000
}

app1.wade-usa.com {
    reverse_proxy app1-site:80
}

# Add other subdomains here
# shop.wade-usa.com {
#     reverse_proxy shop-site:80
# }
```

*   This configuration maps each domain/subdomain to its corresponding Docker service.
*   Caddy will automatically provision and renew SSL certificates from Let's Encrypt.

#### 4. Docker Compose (`docker-compose.yml`)

Your `docker-compose.yml` file will define all the services and tie them together.

```yaml
version: '3.8'

services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config

  main-site:
    build: ./apps/main-site
    restart: unless-stopped
    # No ports exposed to host, Caddy handles it

  app1-site:
    build: ./apps/app1-site # Assuming you create an app1-site
    restart: unless-stopped

  auth-service:
    build: ./backend # Assuming your auth service is in 'backend'
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/mydatabase
      - JWT_SECRET=your-super-secret-key
      - COOKIE_DOMAIN=.wade-usa.com # Crucial for SSO
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydatabase

volumes:
  caddy_data:
  caddy_config:
  postgres_data:
```

#### 5. Backend: Token Validation

Your backend services for each application need to validate the token from the cookie. Here is a conceptual example using Node.js/Express and the `cookie-parser` and `jsonwebtoken` libraries.

**`server.js` (in a backend service like `api.app1.wade-usa.com`)**
```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookieParser());

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.cookies.auth_token; // Assuming cookie is named 'auth_token'

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // You can attach the user to the request object
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Example of a protected route
app.get('/api/data', protect, (req, res) => {
  // If we get here, the token was valid
  res.json({
    message: `Hello user ${req.user.id}! Here is your protected data.`,
  });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
```

#### 6. Frontend: Handling Redirects

Your React application needs logic to handle the redirection for unauthenticated users. This can be done cleanly with a custom `ProtectedRoute` component.

**`ProtectedRoute.jsx`**
```jsx
import React from 'react';
import { useAuth } from './AuthContext'; // Your auth context

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // While checking for authentication, show a loader
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Construct the redirect URL
    const redirectUri = window.location.href;
    const authUrl = `https://auth.wade-usa.com/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Redirect to the login page
    window.location.href = authUrl;
    return null; // Render nothing while redirecting
  }

  return children; // If authenticated, render the child components
};

export default ProtectedRoute;

// Usage in your router
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

This implementation provides a robust, secure, and scalable foundation for the `wade-usa.com` ecosystem. By centralizing authentication and leveraging browser cookies correctly, you create a professional and user-friendly experience.
