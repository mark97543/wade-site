import React, { useState, useEffect } from "react";
import { useAuth } from "@wade/auth";
import {Button} from "@wade/ui";
import { useNavigate } from "react-router-dom";
import { Input } from "@wade/ui";


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

    return (
        <div className="login_wrapper">
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    labelText={'Email: '}
                    type={'email'}
                    id={'useremail'}
                    value={email}
                    change={(e)=>setEmail(e.target.value)}
                />

                <Input
                    labelText={'Password'}
                    type={'password'}
                    id={'userpassword'}
                    value={password}
                    change={(e)=>setPassword(e.target.value)}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button text="Login" func={handleSubmit} button_type="primary" />   
            </form>

            <p>Need a Account? <a href="/register">Register Here!</a></p>
        </div>
    );
}