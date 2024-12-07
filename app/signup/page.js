'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('User');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (role === "Admin") {
      if (verificationCode !== process.env.NEXT_PUBLIC_ADMIN_VERIFICATION_CODE) {
        setError('Invalid verification code');
        return;
      }
    }
    else if (role === "Customer Support") {
      if (verificationCode !== process.env.NEXT_PUBLIC_CUSTOMER_SUPPORT_VERIFICATION_CODE) {
        setError('Invalid verification code');
        return;
      }
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role, email, password }),
    });
    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Error during signup');
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
          <form className="p-4 p-md-5 border rounded-3 bg-body-tertiary" onSubmit={handleSignup}>
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
              <label htmlFor="floatingName">Name</label>
            </div>
            <div className="form-floating mb-3">
              <select
                className="form-control"
                id="floatingRole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="User">User</option>
                <option value="Analyst">Analyst</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {(role === "Admin" || role === "Customer Support") && (
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingVerificationCode"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                <label htmlFor="floatingVerificationCode">Verification Code</label>
              </div>
            )}
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
            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign Up</button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-100 btn btn-lg btn-secondary mt-3"
            >
              Back to Home
            </button>
            <hr className="my-4" />
            <button className="w-100 btn btn-lg btn-outline-dark" onClick={() => router.push('/login')}>Already have an account? Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}