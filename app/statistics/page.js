'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { analystRoles } from '../utils/authorizationList';

export default function StatisticsPage() {
    const router = useRouter();
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch('/api/auth/check', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();

                if (!analystRoles.includes(data.role)) {
                    router.push('/');
                } else {
                    fetchUserCount();
                }
            } else {
                router.push('/login');
            }
        };

        const fetchUserCount = async () => {
            try {
                const res = await axios.get('/api/statistics');
                setUserCount(res.data.count);
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div className="container py-5">
            <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">View Statistics</h1>
            <br />
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Application Usage</h5>
                    <br />
                    <p className="card-text">Active User: {userCount}</p>
                </div>
            </div>
        </div>
    );
}