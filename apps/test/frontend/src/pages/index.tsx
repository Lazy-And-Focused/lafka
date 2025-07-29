import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import styles from "./home.module.css";

import { validateCookies } from '@/api/validator';

import { AUTH_TYPES } from '@lafka/types';
import { User } from '@lafka/types';
import { useEffect } from 'react';

/* eslint-disable */
type Props = {
  user?: User;
  headers?: any;
};
/* eslint-enable */

const Home: NextPage<Props> = ({ user, headers }) => {
  const router = useRouter();

  
  if (user) {
    useEffect(() => {
      router.push("/posts");
    }, []);
  }

  return (
    <div id="page">
      <div className={styles.login}>
        <span>Войти через...</span>
        <div>
          {
            AUTH_TYPES.map(type =>
              <button
                key={type}
                onClick={() => window.location.href = "http://localhost:3001/api/auth/"+type}
              >
                {type[0].toUpperCase() + type.slice(1)}
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: Props }> => {
  try {
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
  } catch (error) {
    return {
      props: {}
    }    
  }
};

export default Home;
