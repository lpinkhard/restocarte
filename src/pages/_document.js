import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html>
      <Head>
          <link rel="icon" href="/favicon.ico"/>
          <link rel="apple-touch-icon" href="/logo192.png"/>
          <link rel="manifest" href="/manifest.json"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
