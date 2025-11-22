import React, { useState, useEffect } from "react";
import { useAuth } from "@wade/auth";
import {Button} from "@wade/ui";
import { useNavigate } from "react-router-dom";


export function Login_Page() {
    const { login, user, isAuthenticated, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const pending = import.meta.env.VITE_PENDING_USER


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const userInfo=await login(email, password);
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error(err);
        }
    };

    // Use useEffect to watch the 'user' state change AFTER a successful login
    useEffect(() => {
        if (isAuthenticated && user) {
            // This code runs only after React has updated the state
            if(user.role === pending){
                navigate('/pending');
            } else {
                navigate('/landing');
            }
        }
    }, [user]); // Add 'pending' to the dependency array

    // if (isAuthenticated && user) {
    //     return (
    //         <div>
    //             <h1>Welcome, {user.first_name || user.email}!</h1>
    //             <h3>Your Information:</h3>
    //             <pre>{JSON.stringify(user, null, 2)}</pre>
    //             <Button text="Logout" func={logout} button_type="close" />
    //         </div>
    //     );
    // }

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
                <Button text="Login" func={handleSubmit} button_type="primary" />   
            </form>

            <a href="/register">Register</a>
        </div>
    );
}