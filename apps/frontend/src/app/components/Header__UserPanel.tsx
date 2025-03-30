'use client';

import Image from 'next/image';
import FilePencil from '../icons/FilePencil';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { getUserFromSource } from '../../utils/getUser';
import { LAFka } from '@lafka/types';

export default function Header__UserPanel() {
  const [user, setUser] = useState<LAFka.User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUserFromSource();

      if (res.error) setError(true);
      else {
        setUser(res.result);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isError || isLoading)
    return (
      <div
        className={
          'flex flex-row items-center justify-end gap-5 ' +
          (isLoading && !isError ? 'animate-pulse' : '')
        }
      >
        <Image
          className='aspect-square h-8 w-8 rounded-full'
          src='https://laf-info.netlify.app/images/avatars/default.png'
          alt={'Loading avatar'}
          width='32'
          height='32'
        />
        Inkognito ({isError ? 'Error' : 'Logging...'})
      </div>
    );

  if (!user)
    return (
      // ЗАГЛУШКА (ну почти). В будущем переделаю/ем
      <div className='flex flex-row flex-wrap items-center justify-center gap-2 text-[#EFDBB3]'>
        <p>Войти через</p>
        <form action={() => redirect(`http://localhost:3001/api/auth/yandex`)}>
          <button
            className='flex items-center justify-center rounded-lg border border-[#EFDBB3] px-4 py-1'
            type='submit'
          >
            Яндекс
          </button>
        </form>
        <form action={() => redirect(`http://localhost:3001/api/auth/google`)}>
          <button
            className='flex items-center justify-center rounded-lg border border-[#EFDBB3] px-4 py-1'
            type='submit'
          >
            Google
          </button>
        </form>
      </div>
    );
  else
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
