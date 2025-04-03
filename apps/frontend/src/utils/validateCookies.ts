import { cookies } from 'next/headers';

export default async function validateCookie(name: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);

  return !!cookie ? cookie.value : false;
}
