'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { adminRoles } from '../utils/authorizationList';

export default function AdminPage() {
    const router = useRouter();
    const [userCounts, setUserCounts] = useState({ user: 0, analyst: 0, customerSupport: 0, admin: 0 });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch('/api/auth/check', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();

                if (!adminRoles.includes(data.role)) {
                    router.push('/');
                } else {
                    fetchUserCounts();
                    fetchUsers();
                }
            } else {
                router.push('/login');
            }
        };

        const fetchUserCounts = async () => {
            try {
                const res = await axios.get('/api/admin/userCounts');
                setUserCounts(res.data);
            } catch (error) {
                console.error('Error fetching user counts:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await axios.get('/api/admin/users');
                setUsers(res.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        checkAuth();
    }, [router]);

    const handleDelete = async (userId) => {
        try {
            await axios.delete('/api/admin/users', { data: { userId } });
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="container py-5">
            <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">Admin Portal</h1>
            <br />
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Account Count</h5>
                    <br />
                    <p className="card-text">User: {userCounts.user}</p>
                    <p className="card-text">Analyst: {userCounts.analyst}</p>
                    <p className="card-text">Customer Support: {userCounts.customerSupport}</p>
                    <p className="card-text">Admin: {userCounts.admin}</p>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Account Detail</h5>
                    <br />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}