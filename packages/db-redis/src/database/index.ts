import { createClient } from "redis";

export default async function(url: string, connect: boolean = true) {
    const redis = createClient({url});

    if (connect)
        await redis.connect()
            .then(() => console.log("connected to Redis"))
            .catch((e) => console.error(e));

    redis.on("error", (e) => console.log("Redis Error\n", e));

    return redis;
};