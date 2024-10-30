import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useGlobalState } from '../context/GlobalStateContext';


/**
 * @description - Login Page for the user to login
 * This component renders a form for users to log into their account.
 * @returns - Login form
 */


const Login = () => {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Retrieve setUser function from global state context
    const { setUser } = useGlobalState();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        await loginUser(email, password);
    };

    // Function to handle user login
    const loginUser = async (email, password) => {
        // Validate input
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            // Make an API call to your login endpoint
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            // Parse the JSON response
            const data = await res.json();

            if (res.ok) {
                // Set user in global context and redirect to chat page if successful
                setUser(data.user.name);
                router.push('/chatPage');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (error) {
            setError('Server error, please try again later.');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={() => router.push('/signupPage')}>Don't have an account? Sign Up</button>
        </div>
    );
};

export default Login;