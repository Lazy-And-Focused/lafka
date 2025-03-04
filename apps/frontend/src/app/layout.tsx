import type { Metadata } from 'next';

import '@/utils/fontsLoader';
import './globals.css';

import Image from 'next/image';
import FilePencil from './icons/FilePencil';

export const metadata: Metadata = {
  title: 'Lafka',
  description: 'The best forum of the World.',
  applicationName: 'Lafka',
  authors: [
    { name: 'Valentin Bird', url: 'https://lanvalird.netlify.app/' },
    { name: 'FOCKUSTY', url: 'https://fockusty.netlify.app/' },
  ],
  category: 'forum',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
      <body>
        <header>
          <h1>
            <Image
              className='h-10 w-auto'
              src={'/logotype.png'}
              alt={'Logotype'}
              width='256'
              height='70'
            />
          </h1>

          <div className='flex flex-row items-center justify-end gap-5'>
            <button className='flex h-6 w-6 items-center justify-center rounded-lg border border-[#EFDBB3] text-[#EFDBB3]'>
              <FilePencil width={16} height={16} />
            </button>
            <Image
              className='aspect-square h-8 w-8 rounded-full'
              src={'https://laf-info.netlify.app/images/avatars/default.png'}
              alt={'Logotype'}
              width='32'
              height='32'
            />
          </div>
        </header>

        <main>{children}</main>

        <footer>
          <a href='https://laf-info.netlify.app/' target='_blank'>
            <Image
              className='h-6 w-auto'
              src='/made-laf.png'
              alt='Made with LAF'
              width='128'
              height='25'
            />
          </a>
        </footer>
      </body>
    </html>
  );
}
