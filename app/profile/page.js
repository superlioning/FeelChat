'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { generalRoles } from '../utils/authorizationList';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState({ email: '', role: '' });
    const [name, setName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch('/api/auth/check', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();

                if (!generalRoles.includes(data.role)) {
                    router.push('/');
                }

                setUser(data);
                setName(data.name);
            } else {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/profile', {
                email: user.email,
                name,
                oldPassword,
                newPassword,
            });

            if (res.status === 200) {
                setStatus('Profile updated successfully!');
                setOldPassword('');
                setNewPassword('');
            } else {
                setStatus('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setStatus('Failed to update profile.');
        }
    };

    return (
        <div className="container col-xl-10 col-xxl-8 px-4 py-5">
            <div className="row align-items-center g-lg-5 py-5">
                <div className="col-lg-7 text-center text-lg-start">
                    <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">Profile</h1>
                    <p className="col-lg-10 fs-4 mt-4">Manage your profile information.</p>
                </div>
                <div className="col-md-10 mx-auto col-lg-5">
                    <form className="p-4 p-md-5 border rounded-3 bg-body-tertiary" onSubmit={handleUpdate}>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingEmail"
                                placeholder="Email"
                                value={user.email}
                                readOnly
                            />
                            <label htmlFor="floatingEmail">Email (read-only)</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingRole"
                                placeholder="Role"
                                value={user.role}
                                readOnly
                            />
                            <label htmlFor="floatingRole">Role (read-only)</label>
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
                            <label htmlFor="floatingName">Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingOldPassword"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingOldPassword">Old Password</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingNewPassword"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <label htmlFor="floatingNewPassword">New Password</label>
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">
                            Update Profile
                        </button>
                        {status && <div className="mt-3 alert alert-info">{status}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}