'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { analystRoles } from '../utils/authorizationList';

export default function StatisticsPage() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch('/api/auth/check', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();

                if (!analystRoles.includes(data.role)) {
                    router.push('/');
                }
            } else {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div>
            <h1>Statistics Page</h1>
        </div>
    );
}