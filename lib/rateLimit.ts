import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;
let disabled = false;

function getRatelimit() {
  if (disabled) return null;
  if (ratelimit) return ratelimit;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    disabled = true;
    return null;
  }

  const redis = Redis.fromEnv();
  ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "10 m"), analytics: true });
  return ratelimit;
}

export async function checkRateLimit(key: string) {
  const rl = getRatelimit();
  if (!rl) {
    return { success: true, limit: 0, remaining: 0, reset: Date.now() };
  }
  return rl.limit(key);
}
