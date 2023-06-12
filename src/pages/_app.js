import '@aws-amplify/ui-react/styles.css';
import 'semantic-ui-css/semantic.min.css';
import "../styles/global.css";

import Head from "next/head";
import {appWithTranslation} from "next-i18next";

import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

Amplify.configure({ ...awsExports, ssr: true });

const MyApp = ({ Component, pageProps }) => {
    return (
        <div>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#000000"/>
                <meta name="description" content="Restaurant Menu System" />
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <title>Restocarte</title>
            </Head>
            <Component {...pageProps} />
        </div>
    )
}

export default appWithTranslation(MyApp);
