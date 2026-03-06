'use server';

import { Suspense } from 'react';

import Link from 'next/link';
import Loading from './loading';
import DisplayUser from './display-user';

import { getUser } from '@/shared/user';

export default async function UserPanel() {
  const user = await getUser();

  return (
    <Suspense fallback={<Loading />}>
      {user ? <DisplayUser user={user} /> : <LogIn />}
    </Suspense>
  );
}

function LogIn() {
  return (
    <Link
      href='/auth'
      className='flex items-center justify-center rounded-lg border border-[#EFDBB3] px-4 py-1'
    >
      Авторизация
    </Link>
  );
}
