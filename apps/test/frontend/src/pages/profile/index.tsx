import { GetServerSidePropsContext, NextPage } from "next";

import styles from "./index.module.css";

import { validateCookies } from "@/api/validator";
import { User } from "@lafka/types";

import { UserComponent } from "@/components/user/user.component";

/* eslint-disable */
type Props = {
  user?: User;
  headers?: any;
};
/* eslint-enable */

const Page: NextPage<Props> = ({ user }) => {
  return (
    <div id="page">
      <div id={styles.user}>
        <UserComponent user={user} />
      </div>
    </div>
  )
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

export default Page;
