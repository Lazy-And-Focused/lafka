'use client';

import type { AuthTypes } from '@lafka/types';

import { AUTH_TYPES } from '@lafka/types';

import { redirect } from 'next/navigation';

export default function AuthPage() {
  // Нужно вынести путь в константу
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/auth`;

  return (
    <div className='section-block w-full max-w-sm'>
      <h2 className='mb-2'>Войти через</h2>

      <form className='flex flex-col gap-2'>
        {services.map((s) => (
          <button
            key={s}
            type='button'
            className='mb-2 flex w-full items-center justify-center rounded-lg border border-[#EFDBB3] px-4 py-1'
            onClick={() => redirect(`${baseUrl}/${s.toLowerCase()}`)}
          >
            {locale[s]}
          </button>
        ))}
      </form>
    </div>
  );
}

const services = AUTH_TYPES;

const locale: Record<AuthTypes, string> = {
  google: 'Google',
  yandex: 'Яндекс',
};
