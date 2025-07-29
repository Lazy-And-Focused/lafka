import { GetServerSidePropsContext, NextPage } from 'next';

import { UserComponent } from '@/components/user/user.component';
import { LazyPost, User } from '@lafka/types';
import { validateCookies } from '@/api/validator';
import { Post } from '@/components/posts/post.component';
import { useEffect, useState } from 'react';
import { Posts } from '@/components/posts/posts.component';

/* eslint-disable */
type Props = {
  user?: User;
  headers?: any;
};
/* eslint-enable */

const Home: NextPage<Props> = ({ user, headers }) => {
  return <main></main>;
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> => {
  const headers = validateCookies(ctx);

  if (!headers) return { props: {} };

  const user = await fetch('http://localhost:3001/api/users/@me', { headers });

  if (user.status !== 200) return { props: {} };

  const { data } = await user.json();

  return {
    props: {
      user: data,
      headers,
    },
  };
};

export default Home;
