import React from 'react';
import Layout from '../components/Layout';
import Chat from '../components/Chat';
import { useGlobalState } from '../context/GlobalStateContext';


/**
 * @returns - The main page of the application where the user enters their name and accesses the chat
 */


const IndexPage = () => {

    // Extract user, setUser, and room state from global context
    const { user, setUser, room } = useGlobalState();

    // Event handler to set the user's name on 'Enter' key press
    const handleKeyUp = (evt) => {
        if (evt.keyCode === 13) {
            const enteredUser = evt.target.value;
            setUser(enteredUser);
        }
    };

    return (
        <Layout pageTitle="FeelChat">
            <main className="container-fluid position-absolute h-100 bg-dark">
                <div className="row position-absolute w-100 h-100">

                    {/* Section for user greeting and name input */}
                    <section className="col-md-8 d-flex flex-row flex-wrap align-items-center align-content-center px-5">
                        <div className="px-5 mx-5">
                            <span className="d-block w-100 h1 text-light" style={{ marginTop: -100 }}>
                                {
                                    user ?
                                        (<span>
                                            <span style={{ color: '#999' }}>Hello!</span> {user}
                                            <br />
                                            <span style={{ color: '#999' }}> Chatting in </span> {room}
                                        </span>)
                                        :
                                        (`What is your name?`)
                                }
                            </span>
                            {!user && (
                                <input
                                    type="text"
                                    className="mt-3 form-control px-3 py-2"
                                    onKeyUp={handleKeyUp}
                                    autoComplete="off"
                                    placeholder="Enter your name..."
                                    style={{
                                        background: 'transparent',
                                        color: '#999',
                                        borderTop: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        borderBottom: '1px solid #666',
                                        fontSize: '2rem',
                                        fontWeight: 600,
                                        boxShadow: 'none',
                                    }}
                                />
                            )}
                        </div>
                    </section>

                    {/* Section for the Chat component, displayed only when the user is set */}
                    <section className="col-md-4 position-relative d-flex flex-wrap h-100 align-items-start align-content-between bg-white px-0">
                        {user && <Chat activeUser={user} />}
                    </section>

                </div>
            </main>
        </Layout>
    );
};

export default IndexPage;