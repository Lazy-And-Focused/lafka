import Document, { Html, Head, Main, NextScript } from 'next/document';
import Image from 'next/image';

import Header from '@/components/layout/header.layout';
import Footer from '@/components/layout/footer.layout';

class MyDocument extends Document {
  public readonly render = () => {
    return (
      <Html lang='ru'>
        <Head>
          <link rel="alternate" href="atom.xml" type="application/atom+xml" title="Atom" />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
        </Head>

        <body>
          <Image id='background' src={"/background.png"} alt='background' width={1920} height={1080} />
          
          <Header page={this.props.__NEXT_DATA__.page} />
          
          <main>
            <Main />
          </main>
          
          <Footer />

          <NextScript />
        </body>
      </Html>
    )
  };
}

export default MyDocument;
