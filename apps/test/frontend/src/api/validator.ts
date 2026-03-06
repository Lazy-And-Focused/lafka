import { GetServerSidePropsContext } from 'next';

export const validateCookies = (ctx?: GetServerSidePropsContext) => {
  if (!ctx) return false;

  const token = ctx.req.cookies['id-token'];

  return token ? { token } : false;
};
