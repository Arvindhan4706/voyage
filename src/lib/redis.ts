import Redis from "ioredis";

// Global redis instance to prevent connection exhaustion in dev
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(process.env.REDIS_URL || "redis://localhost:6379");

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// Helper caching function
export async function fetchWithCache(key: string, fetcher: () => Promise<any>, ttlSeconds = 3600) {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  } catch (error) {
    console.error("Redis Cache Miss/Error:", error);
  }

  const data = await fetcher();

  try {
    if (data) await redis.setex(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    console.error("Redis Set Error:", error);
  }

  return data;
}
