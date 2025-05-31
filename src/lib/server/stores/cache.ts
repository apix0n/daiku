import { writable } from 'svelte/store';

type CacheEntry<T = any> = {
    maxTimestamp?: number;
    data: T;
};

type CacheStore = Record<string, CacheEntry>;

const createCacheStore = () => {
    const { subscribe, set, update } = writable<CacheStore>({});

    console.log("cache store | initialised cache")

    return {
        subscribe,
        get: <T = any>(key: string): CacheEntry<T> | undefined => {
            let value: CacheEntry<T> | undefined;
            subscribe((data) => (value = data[key]))();
            return value;
        },
        set: <T = any>(key: string, entry: CacheEntry<T>) => update(data => ({ ...data, [key]: entry })),
        clear: (key: string) => update(data => ({ ...data, [key]: { maxTimestamp: 0, data: null } })),
        isFresh: (key: string, now: number): boolean => {
            const entry = cacheStore.get(key);
            return Boolean(entry?.maxTimestamp && entry.data && now < entry.maxTimestamp);
        },
        updateWithTTL: <T = any>(key: string, data: T, ttlMs: number) => {
            const now = Date.now();
            cacheStore.set(key, {
                maxTimestamp: now + ttlMs,
                data
            });
        }
    };
};

export const cacheStore = createCacheStore();
