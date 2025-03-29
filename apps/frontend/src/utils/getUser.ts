'use server';

import { cookies } from 'next/headers';

async function validateCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('id-token');

  return token ? token.value : false;
}

export async function getUserFromSource(): Promise<any> {
  const token = await validateCookie();

  if (!token) return null;

  const res = await fetch('http://localhost:3001/api/users/', {
    method: 'GET',
    headers: {
      token,
    },
  }).then(async (data) => await data.json());

  return res.resource;
}
