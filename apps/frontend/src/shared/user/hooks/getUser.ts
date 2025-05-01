'use server';

import type { LAFka } from '@lafka/types';

import { cache } from 'react';

import DefaultUser from '../../dev/DefaultUser';
import validateCookie from '../validateCookies';

type ComponentResponse = LAFka.User | null;

async function getUser(cached: boolean = true): Promise<ComponentResponse> {
  const isDevMode =
    process.env.NODE_ENV === 'development' &&
    process.env.ENABLE_TEST_USER === 'true';

  console.log(isDevMode);

  if (isDevMode) {
    return DefaultUser;
  }

  const token = await validateCookie('id-token');
  if (!token) {
    return null;
  }

  try {
    const cacheOptions: RequestInit = {
      cache: 'no-cache',
      next: {
        revalidate: 10_800, // 3 hours
      },
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/`, {
      method: 'GET',
      headers: {
        token,
      },
      ...(cached && { ...cacheOptions }),
    });
    const data = await res.json();

    return data.resource;
  } catch {
    return null;
  }
}

export default cache(getUser);
