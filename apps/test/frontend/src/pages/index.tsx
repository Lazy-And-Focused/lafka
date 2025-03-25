import { GetServerSidePropsContext, NextPage } from "next";

import { User } from "@/components/user/user.component";

type Props = {
    user?: any
};
 
const Home: NextPage<Props> = ({ user }) => {
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

            <div style={{width: "300px"}}>
                <span>Your profile:</span>
                <br />
                <User user={user} />
            </div>
        </div>
    )
};

const validateCookies = (ctx?: GetServerSidePropsContext) => {
    if(!ctx)
        return false;

    const token = ctx.req.cookies["id-token"];

    return token
        ? ({ token })
        : false;
};

export const getServerSideProps = async(ctx: GetServerSidePropsContext) => {
    const headers = validateCookies(ctx);

    if(!headers)
        return {props: { user: {} }};

    const user = await fetch("http://localhost:3001/api/users/", {headers});

    if (user.status !== 200) return { props: {}};

    return {
        props: {
            user: (await user.json()).resource
        }
    };
};

export default Home;