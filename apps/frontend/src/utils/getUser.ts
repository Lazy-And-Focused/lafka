'use server';

import { LAFka } from '@lafka/types';
import validateCookie from './validateCookies';
import DefaultUser from './_test/DefaultUser';

export async function getUserFromSource(): Promise<{
  result: LAFka.User | null;
  error: boolean;
}> {
  const token = await validateCookie('id-token');

  if (!token) return { result: null, error: false };

  try {
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_TEST_USER)
      return { result: DefaultUser, error: false };

    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/users/', {
      method: 'GET',
      headers: {
        token,
      },
      cache: 'force-cache',
      next: {
        revalidate: 10_800, // 3 hours
      },
    }).then(async (data) => await data.json());

    return { result: res.resource, error: false };
  } catch {
    return { result: null, error: true };
  }
}
