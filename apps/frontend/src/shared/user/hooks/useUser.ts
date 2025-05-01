'use client';

import { LAFka } from '@lafka/types';
import { useState, useEffect } from 'react';
import getUser from './getUser';

export default function useUser(cached: boolean = true) {
  const [user, setUser] = useState<LAFka.User | null>(null);

  useEffect(() => {
    async function setter() {
      const value = await getUser(cached);
      setUser(value);
    }

    setter();
  }, [cached]);

  return user;
}
