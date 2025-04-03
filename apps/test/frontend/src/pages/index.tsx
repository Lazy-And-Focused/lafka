import { GetServerSidePropsContext, NextPage } from "next";

import { User } from "@/components/user/user.component";
import { LAFka } from "@lafka/types";
import { validateCookies } from "@/api/validator";
import { Post } from "@/components/posts/post.component";

/* eslint-disable */
type Props = {
    user?: LAFka.User,
    headers?: any
};
 /* eslint-enable */

const Home: NextPage<Props> = ({ user, headers }) => {
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
                    <User user={user} />
                </div>

                <div>
                    {
                        (user && headers) 
                            ? <Post userId={user.id} headers={headers}></Post>
                            : <span>You must register</span>
                    }
                </div>
            </div>
            <div id="posts">

            </div>
        </div>
    )
};

export const getServerSideProps = async(ctx: GetServerSidePropsContext): Promise<{ props: Props; }> => {
    const headers = validateCookies(ctx);

    if(!headers)
        return {props: {}};

    const user = await fetch("http://localhost:3001/api/users/", {headers});

    if (user.status !== 200) return { props: {}};

    return {
        props: {
            user: (await user.json()).resource,
            headers,
        }
    };
};

export default Home;