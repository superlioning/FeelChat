import Document, { Html, Head, Main, NextScript } from 'next/document';


/**
 * @returns - Custom Document structure
 */


class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">

                <Head>
                    <meta charSet="utf-8" />
                    <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                        crossOrigin="anonymous"
                    />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>

            </Html>
        );
    }
}

export default MyDocument;