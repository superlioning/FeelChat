import React from 'react';
import Layout from '../components/Layout';
import Chat from '../components/Chat';
import { useGlobalState } from '../context/GlobalStateContext';


/**
 * @returns - The main page of the application where the user enters their name and accesses the chat
 */


const IndexPage = () => {

    // Extract user, setUser, room, and setRoom state from global context
    const { user, setUser, room, setRoom, setChannel, reinitialize } = useGlobalState();

    // Event handler to handle the submission of the user name, room number, and channel
    const handleSubmit = () => {
        const userInput = document.getElementById('userInput').value;
        const roomInput = document.getElementById('roomInput').value;

        if (userInput) {
            setUser(userInput);
        }
        if (roomInput) {
            setRoom(roomInput);
            setChannel(roomInput + '-room');
        }
    };

    // Event handler to handle the exit of the user from the chat
    const handleExit = () => {
        reinitialize();
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
                            {/* Input user name */}
                            <span className="d-block w-100 h1 text-light" style={{ marginTop: -100 }}>
                                {
                                    user ?
                                        (<span>
                                            <span style={{ color: '#999' }}>Hello!</span> {user}
                                        </span>)
                                        :
                                        (`What is your name?`)
                                }
                            </span>
                            {!user && (
                                <input
                                    id="userInput"
                                    type="text"
                                    className="mt-3 form-control px-3 py-2"
                                    autoComplete="off"
                                    placeholder="Enter your name..."
                                    style={inputStyle}
                                />
                            )}
                            {/* Input room number */}
                            <span className="d-block w-100 h1 text-light mt-3">
                                {
                                    user ?
                                        (<span>
                                            <span style={{ color: '#999' }}> Chatting in </span> {room}
                                        </span>)
                                        :
                                        (`Enter room number`)
                                }
                            </span>
                            {!user && (
                                <input
                                    id="roomInput"
                                    type="text"
                                    className="mt-3 form-control px-3 py-2"
                                    autoComplete="off"
                                    placeholder="Leave blank for public"
                                    style={inputStyle}
                                />
                            )}
                            {/* Submit button*/}
                            {!user && (
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
                            {user && (
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

                    {/* Section for the Chat component, displayed only when the user is set */}
                    <section className="col-md-4 position-relative d-flex flex-wrap h-100 align-items-start align-content-between bg-white px-0">
                        {user && <Chat />}
                    </section>

                </div>
            </main>
        </Layout>
    );
};

export default IndexPage;