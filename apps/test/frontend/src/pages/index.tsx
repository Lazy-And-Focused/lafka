import { GetServerSidePropsContext, NextPage } from "next";

import { UserComponent } from "@/components/user/user.component";
import { LazyPost, User } from "@lafka/types";
import { validateCookies } from "@/api/validator";
import { Post } from "@/components/posts/post.component";
import { useEffect, useState } from "react";
import { Posts } from "@/components/posts/posts.component";

/* eslint-disable */
type Props = {
    user?: User,
    headers?: any
};
 /* eslint-enable */

const Home: NextPage<Props> = ({ user, headers }) => {
    const [ posts, setPosts ] = useState<LazyPost[]>();

    useEffect(() => {
        (async () => {
            const data = await fetch("http://localhost:3001/api/posts?cache=false", { headers })
            const posts = await data.json();

            setPosts(posts.data);
        })();
    }, []);

    return (
        <div>
            <div>
                <button onClick={() => window.location.href = "http://localhost:3001/api/auth/google"}>
                    Google register
                </button>
                <button onClick={() => window.location.href = "http://localhost:3001/api/auth/yandex"}>
                    Yandex register
                </button>
            </div>
            
            <br />

            <div id="create" style={{display: "flex", backgroundColor: "#999099", padding: "2em", gap: "3em"}}>
                <div style={{width: "300px", height: "700px"}}>
                    <span>Your profile:</span>
                    <br />
                    <UserComponent user={user} />
                </div>

                <div>
                    {
                        (user && headers) 
                            ? <Post userId={user.id} headers={headers}></Post>
                            : <span>You must register</span>
                    }
                </div>

                <div id="posts-data">
                    <button onClick={async () => {
                        const data = await fetch("http://localhost:3001/api/posts?cache=false", { headers })
                        const posts = await data.json();
                        
                        setPosts(posts.data);
                    }}>Update</button>
                    <Posts posts={posts} headers={headers}></Posts>
                </div>
            </div>
        </div>
    )
};

export const getServerSideProps = async(ctx: GetServerSidePropsContext): Promise<{ props: Props; }> => {
    const headers = validateCookies(ctx);

    if(!headers)
        return {props: {}};

    const user = await fetch("http://localhost:3001/api/users/@me", {headers});

    if (user.status !== 200) return { props: {}};

    const { data } = (await user.json());

    return {
        props: {
            user: data,
            headers,
        }
    };
};

export default Home;