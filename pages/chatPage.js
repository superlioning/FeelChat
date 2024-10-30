import React from 'react';
import Layout from '../components/Layout';
import Chat from '../components/Chat';
import { useGlobalState } from '../context/GlobalStateContext';


/**
 * @description - The chat page of the application where the user enters the room number and accesses the chat
 * This component allows users to join or exit chat rooms.
 * @returns - The chat page of the application
 */


const ChatPage = () => {

    // Extract user, room, setRoom, and setChannel state from global context
    const { user, room, setRoom, setChannel, exitChat } = useGlobalState();

    // Event handler to handle the submission of the room number and channel
    const handleSubmit = () => {
        const roomInput = document.getElementById('roomInput').value;

        if (roomInput) {
            setRoom(roomInput);
            setChannel(roomInput + '-room');
        } else {
            setRoom('Public Room');
            setChannel('public-room');
        }
    };

    // Event handler to handle the exit of the user from the chat
    const handleExit = () => {
        exitChat();
    };

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
                            {/* Join button*/}
                            {!room && (
                                <button
                                    onClick={handleSubmit}
                                    className="btn btn-primary mt-3"
                                    style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        backgroundColor: '#007bff',
                                        marginLeft: '150px',
                                    }}
                                >
                                    Join Chat
                                </button>
                            )}
                            {/* Exit button*/}
                            {room && (
                                <button onClick={handleExit}
                                    className="btn btn-danger mt-3"
                                    style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        marginLeft: '150px',
                                    }}
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