import React, { useState } from "react";
import { useAuth } from "@wade/auth";

export function Login_Page() {
    const { login, user, isAuthenticated, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error(err);
        }
    };

    if (isAuthenticated && user) {
        return (
            <div>
                <h1>Welcome, {user.first_name || user.email}!</h1>
                <h3>Your Information:</h3>
                <pre>{JSON.stringify(user, null, 2)}</pre>
                <button onClick={logout}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}