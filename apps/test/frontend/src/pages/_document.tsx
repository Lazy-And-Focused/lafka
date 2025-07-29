import Document, { Html, Head, Main, NextScript } from 'next/document';

import './global.css';

class MyDocument extends Document {
  public readonly render = () => (
    <Html lang='ru'>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default MyDocument;
