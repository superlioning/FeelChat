import React, { useState } from 'react';
import { useRouter } from 'next/router';


/**
 * @description - Signup Page for the user to signup
 * This component renders a form for users to create a new account.
 * @returns - Signup form
 */


const Signup = () => {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signupUser(name, email, password);
    };

    // Function to handle user signup
    const signupUser = async (name, email, password) => {
        if (!email || !password || !name) {
            setError('All fields are required');
            return;
        }

        try {
            // Make an API call to your signup endpoint
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            // Parse the JSON response
            const data = await res.json();

            if (res.ok) {
                // Redirect to login page upon successful signup
                router.push('/loginPage');
            } else {
                setError(data.message || 'Error during signup');
            }
        } catch (error) {
            setError('Server error, please try again later.');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
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
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <button onClick={() => router.push('/loginPage')}>Already have an account? Login</button>
        </div>
    );
};

export default Signup;