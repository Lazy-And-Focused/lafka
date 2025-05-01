'use server';

import { getUser } from '@/shared/user';
import defaultUserAvatar from '@/shared/value/defaultUserAvatar';
import { LAFka } from '@lafka/types';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import FilePencil from '@/app/_icons/FilePencil';

export default async function Root() {
  const user = await getUser();

  return (
    <Suspense fallback={<LoadingState />}>
      <UserPanel user={user} />
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
        src={defaultUserAvatar}
        alt={'Loading avatar'}
        width='32'
        height='32'
      />
      Inkognito (Logging...)
    </div>
  );
}

function UserPanel({ user }: { user: LAFka.User | null }) {
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
    <div className='flex flex-row items-center justify-center'>
      <button className='mr-5 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-[#EFDBB3] text-[#EFDBB3]'>
        <FilePencil width={16} height={16} />
      </button>

      <Link
        href={`/user/@${user.username}`}
        className='inline-flex flex-row items-center justify-end gap-5'
      >
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
      </Link>
    </div>
  );
}
