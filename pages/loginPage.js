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
        <div className="container col-xl-10 col-xxl-8 px-4 py-5">
            <div className="row align-items-center g-lg-5 py-5">
                <div className="col-lg-7 text-center text-lg-start">
                    <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">Welcome Back!</h1>
                    <p className="col-lg-10 fs-4 ml-5 mt-4">Simple, reliable, private messaging and chatting for free.</p>
                </div>
                <div className="col-md-10 mx-auto col-lg-5">
                    <form className="p-4 p-md-5 border rounded-3 bg-body-tertiary" onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingEmail"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="checkbox mb-3">
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Login</button>
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="w-100 btn btn-lg btn-secondary mt-3"
                        >
                            Back to Home
                        </button>
                        <hr className="my-4" />
                        <button className="w-100 btn btn-lg btn-outline-dark" onClick={() => router.push('/signupPage')}>Don't have an account? Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;