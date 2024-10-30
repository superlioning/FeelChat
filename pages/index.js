import React from 'react';
import { useRouter } from 'next/router';


/**
 * @description - Home page for greeting users and providing buttons to sign up and login
 * @returns - Home page with buttons to sign up and login 
 */


const Home = () => {
    const router = useRouter();

    return (
        <div>
            <h1>Welcome to FeelChat!</h1>
            <button onClick={() => router.push('/signupPage')}>Sign Up</button>
            <button onClick={() => router.push('/loginPage')}>Login</button>
        </div>
    );
};

export default Home;