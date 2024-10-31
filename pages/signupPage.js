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
        <div className="container col-xl-10 col-xxl-8 px-4 py-5">
            <div className="row align-items-center g-lg-5 py-5">
                <div className="col-lg-7 text-center text-lg-start">
                    <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">Join FeelChat Today!</h1>
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
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingName"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="checkbox mb-3">
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign up</button>
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="w-100 btn btn-lg btn-secondary mt-3"
                        >
                            Back to Home
                        </button>
                        <hr className="my-4" />
                        <button className="w-100 btn btn-lg btn-outline-dark mb-4" onClick={() => router.push('/loginPage')}>Already have an account? Login</button>
                        <small className="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;