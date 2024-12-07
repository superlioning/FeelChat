'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '../components/Chat';
import LogoutButton from '../components/LogoutButton';
import { useGlobalState } from '../context/GlobalStateContext';
import { generalRoles } from '../utils/authorizationList';

export default function ChatPage() {
  const router = useRouter();
  const { user, setUser, room, setRoom, setChannel, exitChat } = useGlobalState();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/check', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();

        if (!generalRoles.includes(data.role)) {
          router.push('/');
        }

        setUser(data.name);
      } else {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, setUser]);

  const handleJoinRoom = () => {
    const roomInput = document.getElementById('roomInput').value;

    if (roomInput) {
      setRoom(roomInput);
      setChannel(roomInput + '-room');
    } else {
      setRoom('Public Room');
      setChannel('public-room');
    }
  };

  const handleExit = () => {
    exitChat();
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="container-fluid absolute h-full bg-dark">
      <div className="row absolute w-full h-full">
        <section className="col-md-8 flex flex-row flex-wrap items-center content-center px-5">
          <div className="px-5 mx-5">
            <span className="block w-full h1 text-light" style={{ marginTop: -100 }}>
              <span>
                <span className="text-gray-400">Hello!</span> {user}
              </span>
            </span>
            <span className="block w-full h1 text-light mt-3">
              {room ? (
                <span>
                  <span className="text-gray-400">Chatting in</span> {room === 'Public Room' ? 'Public Room' : `Private Room ${room}`}
                </span>
              ) : (
                <span className="text-gray-400">Enter room number</span>
              )}
            </span>
            {!room && (
              <input
                id="roomInput"
                type="text"
                className="mt-3 form-control px-3 py-2 text-grey border-b border-gray-400 border-t-transparent border-l-transparent border-r-transparent text-xl placeholder-gray-400 focus:outline-none"
                autoComplete="off"
                placeholder="Leave blank for public room"
              />
            )}
            {!room && (
              <div className="flex mt-3" style={{ gap: '50px' }}>
                <button
                  onClick={handleJoinRoom}
                  className="btn btn-lg btn-primary"
                  style={{ width: '150px', height: '50px' }}
                >
                  Join Chat
                </button>
                <LogoutButton />
              </div>
            )}
            {room && (
              <button
                onClick={handleExit}
                className="btn btn-lg btn-warning mt-3"
                style={{ width: '150px', height: '50px' }}
              >
                Exit Chat
              </button>
            )}
          </div>
        </section>
        <section className="col-md-4 relative flex flex-wrap h-full items-start content-between bg-white px-0">
          {room && <Chat />}
        </section>
      </div>
    </div>
  );
}