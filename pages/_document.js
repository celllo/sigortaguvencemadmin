import Document, { Head, Html, Main, NextScript } from 'next/document';
import firebase_app from "@/firebasefile/config";
import { getAuth } from "firebase/auth";
class MyDocument extends Document {

    
    static async getInitialProps(ctx) {
        const auth = getAuth(firebase_app);

        const initialProps = await Document.getInitialProps(ctx);

        return { ...initialProps };
    }

    

    render() {
        return (
            <Html lang="en">
                <Head>
                    <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
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
