import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Chat from '../components/Chat';
import { useGlobalState } from '../context/GlobalStateContext';
import { useRouter } from 'next/router';


/**
 * @description - The chat page of the application where the user enters the room number and accesses the chat
 * This component allows users to join or exit chat rooms.
 * @returns - The chat page of the application
 */


const ChatPage = () => {

    const router = useRouter();

    // Extract user, room, setRoom, and setChannel state from global context
    const { user, room, setRoom, setChannel, exitChat, logout } = useGlobalState();

    // Event handler to handle the submission of the room number and channel
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

    // Event handler to handle the logout of the user
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // Event handler to handle the exit of the user from the chat
    const handleExit = () => {
        exitChat();
    };

    // Prevent the user from refreshing the page
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Logout the user if the user name global state is lost
    useEffect(() => {
        if (!user) {
            handleLogout();
        }
    }, [user]);

    const inputStyle = {
        background: 'transparent',
        color: '#999',
        border: 'none',
        borderBottom: '1px solid #666',
        fontSize: '2rem',
        fontWeight: 600,
        boxShadow: 'none !important',
    };

    return (
        <Layout pageTitle="FeelChat">
            <main className="container-fluid position-absolute h-100 bg-dark">
                <div className="row position-absolute w-100 h-100">

                    {/* Section for user greeting and user input */}
                    <section className="col-md-8 d-flex flex-row flex-wrap align-items-center align-content-center px-5">
                        <div className="px-5 mx-5">
                            {/* Display user name */}
                            <span className="d-block w-100 h1 text-light" style={{ marginTop: -100 }}>
                                {
                                    (<span>
                                        <span style={{ color: '#999' }}>Hello!</span> {user}
                                    </span>)
                                }
                            </span>
                            {/* Input room number */}
                            <span className="d-block w-100 h1 text-light mt-3">
                                {
                                    room ?
                                        (<span>
                                            <span style={{ color: '#999' }}>Chatting in</span> {room}
                                        </span>)
                                        :
                                        (
                                            <span style={{ color: '#999' }}>Enter room number</span>
                                        )
                                }
                            </span>
                            {!room && (
                                <input
                                    id="roomInput"
                                    type="text"
                                    className="mt-3 form-control px-3 py-2"
                                    autoComplete="off"
                                    placeholder="Leave blank for public"
                                    style={inputStyle}
                                />
                            )}
                            {/* Join and logout buttons*/}
                            {!room && (
                                <div className="d-flex mt-3" style={{ gap: '50px' }}>
                                    <button
                                        onClick={handleJoinRoom}
                                        className="btn btn-lg btn-primary"
                                        style={{ width: '150px', height: '50px' }}
                                    >
                                        Join Chat
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-lg btn-danger"
                                        style={{ width: '150px', height: '50px' }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                            {/* Exit button*/}
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

                    {/* Section for the Chat component, displayed only when the room is set */}
                    <section className="col-md-4 position-relative d-flex flex-wrap h-100 align-items-start align-content-between bg-white px-0">
                        {room && <Chat />}
                    </section>

                </div>
            </main>
        </Layout>
    );
};

export default ChatPage;