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
  usernameOrId?: string,
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
    return null;
  }

  try {
    let userSlug: string = '';
    if (usernameOrId) {
      const isValidSlug: boolean = validateUserSlug(usernameOrId);

      if (isValidSlug) {
        userSlug = usernameOrId;
      }
    }

    const cacheOptions: RequestInit = {
      cache: 'no-cache',
      next: {
        revalidate: 10_800, // 3 hours
      },
    };

    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API}/users`;

    const res = await fetch(`${baseUrl}/${userSlug}`, {
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
