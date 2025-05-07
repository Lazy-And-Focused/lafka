'use client';

import { LAFka } from '@lafka/types';
import { useState, useEffect } from 'react';
import getUser from './get-user';

export default function useUser() {
  const [user, setUser] = useState<LAFka.User | null>(null);

  useEffect(() => {
    async function setter() {
      const value = await getUser();
      setUser(value);
    }

    setter();
  }, []);

  return user;
}
