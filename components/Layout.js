import React, { Fragment } from 'react';
import Head from 'next/head';


/**
 * @param {*} props 
 * @returns - Functional component Layout that accepts props 
 */


const Layout = (props) => (
    <Fragment>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>{props.pageTitle}</title>
        </Head>
        {props.children}
    </Fragment>
);

export default Layout;