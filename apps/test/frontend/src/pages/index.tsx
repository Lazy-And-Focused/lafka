import { LAFka } from '@lafka/types';

import { GetServerSidePropsContext, NextPage } from 'next';

import { User } from '@/components/user/user.component';
import { Post } from '@/components/posts/post.component';
import { validateCookies } from '@/api/validator';

import Link from 'next/link';

import './main.css';

/* eslint-disable */
type Props = {
  user?: LAFka.User;
  headers?: any;
};
/* eslint-enable */

const authMethods = LAFka.AUTH_TYPES;

const Home: NextPage<Props> = ({ user, headers }) => {
  return (
    <>
      <div className='auth-btns-wrapper'>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          Войти через
        </h1>

        {authMethods.map((method) => (
          <button className='btn btn-auth'>
            <Link href={`${process.env.NEXT_BACKEND_URL}/api/auth/${method}`}>
              {method.toUpperCase()}
            </Link>
          </button>
        ))}
      </div>

      {user && <User user={user} />}
      {/* {user && headers && <Post userId={user.id} headers={headers} />} */}
    </>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> => {
  const headers = validateCookies(ctx);

  if (!headers) return { props: {} };

  const user = await fetch(`${process.env.NEXT_BACKEND_URL}/api/users/`, {
    headers,
  });

  if (user.status !== 200) return { props: {} };

  return {
    props: {
      user: (await user.json()).resource,
      headers,
    },
  };
};

export default Home;
