import React from 'react';
import { useRouter } from 'next/router';


/**
 * @description - Home page for greeting users and providing buttons to sign up and login
 * @returns - Home page with buttons to sign up and login 
 */


const Home = () => {
    
    const router = useRouter();

    return (
        <div className="container col-xxl-8 px-4 py-5">
            <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                <div className="col-10 col-sm-8 col-lg-6">
                    <img
                        src="/OnlineChat.jpg"
                        className="d-block mx-lg-auto img-fluid"
                        alt="Bootstrap Themes"
                        width="700"
                        height="500"
                        loading="lazy"
                    />
                </div>
                <div className="col-lg-6">
                    <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">FeelChat</h1>
                    <br />
                    <p className="lead">
                        A real-time web-based chat application that integrates sentiment analysis to enhance communication by providing instant emotional insights during conversations.
                    </p>
                    <br />
                    <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                        <button
                            type="button"
                            onClick={() => router.push('/signupPage')}
                            className="btn btn-primary btn-lg px-4 me-md-2 mr-3"
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/loginPage')}
                            className="btn btn-outline-secondary btn-lg px-4"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;