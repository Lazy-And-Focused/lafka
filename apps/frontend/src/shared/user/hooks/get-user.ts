'use server';

import type { LAFka } from '@lafka/types';

import { cache } from 'react';

import DefaultUser from '../../dev/DefaultUser';
import validateCookie from '../validate-cookies';

type ComponentResponse = LAFka.User | null;

/**
 * Fetch the user from server.
 *
 * @param usernameOrId Slug of username or user ID
 * @param cached Should the request to the server be cached?
 *
 * @returns Promise<ComponentResponse>
 */
async function getUser(
  userSlug: string = '',
  cached: boolean = true,
): Promise<ComponentResponse> {
  const isDevMode =
    process.env.NODE_ENV === 'development' &&
    process.env.ENABLE_TEST_USER === 'true';

  if (isDevMode) {
    return DefaultUser;
  }

  const token = await validateCookie('id-token');
  if (!token) {
    console.log('нет токена');
    return null;
  }

  try {
    if (userSlug !== '' && !validateUserSlug(userSlug)) {
      userSlug = '';
    }

    const cacheOptions: RequestInit = {
      cache: 'no-cache',
      next: {
        revalidate: 10_800, // 3 hours
      },
    };

    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/users`;
    console.log(`GET: ${baseUrl}/${userSlug}`);

    const res = await fetch(`${baseUrl}/${userSlug}`, {
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

/**
 * Function checks whether the Slug is a valid username or a number (ID).
 *
 * @param slug Username or User ID
 * @returns boolean
 */
function validateUserSlug(slug: string): boolean {
  // '%40' == '@' (not '===' !)
  if (slug.startsWith('%40') || !isNaN(+slug)) {
    return true;
  } else {
    return false;
  }
}

export default cache(getUser);
