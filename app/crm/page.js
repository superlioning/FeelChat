'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { customerSupportRoles } from '../utils/authorizationList';

export default function CRMPage() {
    const router = useRouter();
    const [cases, setCases] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch('/api/auth/check', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();

                if (!customerSupportRoles.includes(data.role)) {
                    router.push('/');
                } else {
                    fetchCases();
                }
            } else {
                router.push('/login');
            }
        };

        const fetchCases = async () => {
            try {
                const res = await axios.get('/api/case');
                setCases(res.data);
            } catch (error) {
                console.error('Error fetching cases:', error);
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div className="container py-5">
            <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">View Cases</h1>
            <br />
            {cases.length > 0 ? (
                cases.map((caseItem) => (
                    <div key={caseItem._id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{caseItem.clientName}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">{caseItem.clientEmail}</h6>
                            <br />
                            <p className="card-text">{caseItem.message}</p>
                            <p className="card-text">
                                <small className="text-muted">Submitted on {new Date(caseItem.timestamp).toLocaleString()}</small>
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No cases found.</p>
            )}
        </div>
    );
}