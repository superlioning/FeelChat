'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { customerSupportRoles } from '../utils/authorizationList';

export default function CRMPage() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch('/api/auth/check', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();

                if (!customerSupportRoles.includes(data.role)) {
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
            <h1>CRM Page</h1>
        </div>
    )
}