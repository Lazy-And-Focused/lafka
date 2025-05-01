import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import UserPanel from './user-panel';

export default function Header(
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
) {
  return (
    <header {...props}>
      <h1>
        <Link href='/'>
          <Image
            className='h-10 w-auto'
            src={'/logotype.png'}
            alt={'Logotype'}
            width='256'
            height='70'
          />
        </Link>
      </h1>

      <UserPanel />
    </header>
  );
}
