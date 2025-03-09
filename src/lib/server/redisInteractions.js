import { KV_REST_API_URL, KV_REST_API_TOKEN } from "$env/static/private";
import { Redis } from '@upstash/redis';

export async function setValue(key, value) {
    const redis = new Redis({
        url: KV_REST_API_URL || "",
        token: KV_REST_API_TOKEN || ""
    });

    try {
        await redis.set(key, value);
    }
    catch (error) {
        throw new Error();
    }
}

export async function getValue(key) {
    const redis = new Redis({
        url: KV_REST_API_URL || "",
        token: KV_REST_API_TOKEN || ""
    });

    try {
        return await redis.get(key);
    }
    catch (error) {
        throw new Error();
    }
}