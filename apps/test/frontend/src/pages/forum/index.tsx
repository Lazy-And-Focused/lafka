import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";

import styles from "./index.module.css";

import { validateCookies } from "@/api/validator";
import { LazyPost, User } from "@lafka/types";

import { Posts } from "@/components/posts/posts.component";

/* eslint-disable */
type Props = {
  user?: User;
  headers?: any;
};
/* eslint-enable */

const Page: NextPage<Props> = ({ user, headers }) => {
  const [ posts, setPosts ] = useState<LazyPost[]>([]);

    useEffect(() => {
      (async () => {
        const data = await fetch("http://localhost:3001/api/posts?cache=false", { headers });
        const posts = await data.json();

        setPosts(posts.data);
      })();
    }, []);

  return (
    <div id="page" style={{alignItems: "normal", justifyContent: "normal"}}>
      <div id={styles.posts}>
        <Posts posts={posts}/>
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
