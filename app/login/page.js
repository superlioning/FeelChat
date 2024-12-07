'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../context/GlobalStateContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const { setRole } = useGlobalState();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setRole(data.role);
      router.push('/chat');
    } else {
      const data = await res.json();
      setError(data.message || 'Invalid credentials');
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
          <form className="p-4 p-md-5 border rounded-3 bg-body-tertiary" onSubmit={handleLogin}>
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
              <label htmlFor="floatingEmail">Email</label>
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
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="checkbox mb-3">
              {error && <p className="text-danger">{error}</p>}
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">Log In</button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-100 btn btn-lg btn-secondary mt-3"
            >
              Back to Home
            </button>
            <hr className="my-4" />
            <button className="w-100 btn btn-lg btn-outline-dark" onClick={() => router.push('/signup')}>Don't have an account? Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}