'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../context/GlobalStateContext';
import { generalRoles, analystRoles, customerSupportRoles, adminRoles } from '../utils/authorizationList';

export default function Navbar() {
    const router = useRouter();
    const { role, logout } = useGlobalState();

    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">
                    FeelChat
                </Link>
                <ul className="navbar-nav ms-auto d-flex flex-row gap-4">
                    {generalRoles.includes(role) && (
                        <li className="nav-item">
                            <Link className="nav-link" href="/chat">
                                Chat
                            </Link>
                        </li>
                    )}
                    {generalRoles.includes(role) && (
                        <li className="nav-item">
                            <Link className="nav-link" href="/feedback">
                                Feedback
                            </Link>
                        </li>
                    )}
                    {generalRoles.includes(role) && (
                        <li className="nav-item">
                            <Link className="nav-link" href="/profile">
                                Profile
                            </Link>
                        </li>
                    )}
                    {analystRoles.includes(role) && (
                        <li className="nav-item">
                            <Link className="nav-link" href="/statistics">
                                Statistics
                            </Link>
                        </li>
                    )}
                    {customerSupportRoles.includes(role) && (
                        <li className="nav-item">
                            <Link className="nav-link" href="/crm">
                                CRM
                            </Link>
                        </li>
                    )}
                    {adminRoles.includes(role) && (
                        <li className="nav-item">
                            <Link className="nav-link" href="/admin">
                                Admin
                            </Link>
                        </li>
                    )}
                    {generalRoles.includes(role) && (
                        <li className="nav-item">
                            <button
                                onClick={async () => {
                                    await fetch('/api/auth/logout', { method: 'POST' });
                                    logout();
                                    router.push('/');
                                }}
                                className="nav-link"
                                style={{ background: 'none', border: 'none' }}
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}