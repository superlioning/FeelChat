'use client';

import { useRouter } from 'next/navigation';
import { useGlobalState } from '../context/GlobalStateContext';

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useGlobalState();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-lg btn-danger"
      style={{ width: '150px', height: '50px' }}
    >
      Logout
    </button>
  );
}