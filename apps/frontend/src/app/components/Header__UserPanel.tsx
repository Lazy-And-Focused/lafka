'use server';

import Image from 'next/image';
import FilePencil from '../icons/FilePencil';
import { Suspense } from 'react';
import { getUserFromSource } from '../../utils/getUser';
import { LAFka } from '@lafka/types';
import Link from 'next/link';

export default async function Root() {
  return (
    <Suspense fallback={<LoadingState />}>
      <UserPanel />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div
      className={'flex animate-pulse flex-row items-center justify-end gap-5'}
    >
      <Image
        className='aspect-square h-8 w-8 rounded-full'
        src='https://laf-info.netlify.app/images/avatars/default.png'
        alt={'Loading avatar'}
        width='32'
        height='32'
      />
      Inkognito (Logging...)
    </div>
  );
}

async function UserPanel() {
  const user: LAFka.User | null = await getUserFromSource().then((data) => {
    return data.result;
  });

  if (!user)
    return (
      <Link
        className='flex items-center justify-center rounded-lg border border-[#EFDBB3] px-4 py-1'
        href='/auth'
      >
        Авторизация
      </Link>
    );

  return (
    <div className='flex flex-row items-center justify-end gap-5'>
      <button className='flex h-6 w-6 items-center justify-center rounded-lg border border-[#EFDBB3] text-[#EFDBB3]'>
        <FilePencil width={16} height={16} />
      </button>
      <Image
        className='aspect-square h-8 w-8 rounded-full'
        src={
          user.avatar ||
          'https://laf-info.netlify.app/images/avatars/default.png'
        }
        alt={`${user.username}'s avatar`}
        width='32'
        height='32'
      />
      {user.nickname || user.username}
    </div>
  );
}
