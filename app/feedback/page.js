'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { generalRoles } from '../utils/authorizationList';

export default function FeedbackPage() {
    const router = useRouter();

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch('/api/auth/check', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();

                if (!generalRoles.includes(data.role)) {
                    router.push('/');
                }

                setClientName(data.name);
                setClientEmail(data.email);
            } else {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/feedback', {
                clientName,
                clientEmail,
                message,
            });

            if (res.status === 200) {
                setStatus('Feedback submitted successfully!');
                setMessage('');
            } else {
                setStatus('Failed to submit feedback.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatus('Failed to submit feedback.');
        }
    };

    return (
        <div className="container col-xl-10 col-xxl-8 px-4 py-5">
            <div className="row align-items-center g-lg-5 py-5">
                <div className="col-lg-7 text-center text-lg-start">
                    <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">Feedback</h1>
                    <p className="col-lg-10 fs-4 mt-4">We value your feedback.</p>
                </div>
                <div className="col-md-10 mx-auto col-lg-5">
                    <form className="p-4 p-md-5 border rounded-3 bg-body-tertiary" onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingClientName"
                                placeholder="Client Name"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingClientName">Your Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingClientEmail"
                                placeholder="Client Email"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingClientEmail">Your Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <textarea
                                className="form-control"
                                id="floatingMessage"
                                placeholder="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                style={{ height: '150px' }}
                            ></textarea>
                            <label htmlFor="floatingMessage">Message</label>
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">
                            Submit Feedback
                        </button>
                        {status && <div className="mt-3 alert alert-info">{status}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}