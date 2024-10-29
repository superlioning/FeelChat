import React from 'react';
import { GlobalStateProvider } from '../context/GlobalStateContext';


/**
 * @param {Component} Component
 * @param {pageProps} pageProps
 * @returns - The entire application wrapped with the GlobalStateProvider 
 */


function MyApp({ Component, pageProps }) {
    return (
        <GlobalStateProvider>
            <Component {...pageProps} />
        </GlobalStateProvider>
    );
}

export default MyApp;