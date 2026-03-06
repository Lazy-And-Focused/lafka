'use server';

import type { User } from '@lafka/types';

import { cache } from 'react';

import DefaultUser from '../../dev/DefaultUser';
import validateCookie from '../validate-cookies';

/**
 * Fetch the user from server.
 *
 * @param userSlug Slug of username or user ID
 * @param cached Should the request to the server be cached?
 *
 * @returns {Promise<User | null>} User or null
 */
export async function getUser(
  userSlug: string = '',
  cached: boolean = true,
): Promise<User | null> {
  const isDevMode =
    process.env.NODE_ENV === 'development' &&
    process.env.ENABLE_TEST_USER === 'true';

  if (isDevMode) {
    return DefaultUser;
  }

  // id-token «— магическая строка, лол. Вынесите, как добавите файлы
  //             с константами
  const token = await validateCookie('id-token');
  if (!token) {
    return null;
  }

  if (!isUserSlug(userSlug)) {
    return null;
  }

  try {
    const cacheOptions: RequestInit = {
      cache: 'no-cache',
      next: {
        revalidate: 10_800, // 3 hours
      },
    };

    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/users`;
    const finalUrl = `${baseUrl}/${userSlug}`;

    const res = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        token,
      },
      ...(cached && { ...cacheOptions }),
    });
    const data = await res.json();

    console.log(data);

    return data.resource;
  } catch (e) {
    if (isDevMode) console.error(e);
    return null;
  }
}

// Желательно вынести код ниже, да так, чтобы было по соглашениям,
// включая FAiL

/**
 * Function checks whether the Slug is a valid username or a number (ID).
 *
 * @param slug Username or User ID
 * @returns {boolean}
 */
function isUserSlug(slug: string): boolean {
  // '%40' == '@' (not '===' !)
  if (slug.startsWith('%40') || !isNaN(+slug)) {
    return true;
  } else {
    return false;
  }
}

export default cache(getUser);
