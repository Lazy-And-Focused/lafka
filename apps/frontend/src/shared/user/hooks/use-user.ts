'use client';

import { LAFka } from '@lafka/types';
import { useState, useEffect } from 'react';
import getUser from './get-user';

/**
 * Alternative function from getUser, but works in client components
 *
 * @param userSlug Slug of username or user ID
 * @param cached Should the request to the server be cached?
 *
 * @returns {Promise<LAFka.User | null>} User or null
 */
export default function useUser(
  userSlug?: string,
  cached?: boolean,
): LAFka.User | null {
  const [user, setUser] = useState<LAFka.User | null>(null);

  useEffect(() => {
    async function setter() {
      const user = await getUser(userSlug, cached);
      setUser(user);
    }

    setter();
  }, [userSlug]);

  return user;
}
