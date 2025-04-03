'use client';

import { redirect } from 'next/navigation';

export default function Auth() {
  return (
    <div className='section-block w-full max-w-sm'>
      <h2 className='mb-2'>Войти через</h2>

      <form className='flex flex-col gap-2'>
        <button
          className='mb-2 flex w-full items-center justify-center rounded-lg border border-[#EFDBB3] px-4 py-1'
          type='button'
          onClick={() => redirect(`http://localhost:3001/api/auth/yandex`)}
        >
          Яндекс
        </button>
        <button
          className='flex w-full items-center justify-center rounded-lg border border-[#EFDBB3] px-4 py-1'
          type='button'
          onClick={() => redirect(`http://localhost:3001/api/auth/google`)}
        >
          Google
        </button>
      </form>
    </div>
  );
}
