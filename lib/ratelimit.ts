import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Returns null if Upstash env vars are not set — middleware fails open (never blocks)
function makeRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = makeRedis();

function limiter(requests: number, window: `${number} ${"s" | "m" | "h" | "d"}`) {
  if (!redis) return null;
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(requests, window), prefix: "rl" });
}

// Strict — login / register: 5 attempts per minute per IP
export const authLimiter = limiter(5, "1 m");

// Booking creation: 10 per 10 minutes per IP
export const bookingLimiter = limiter(10, "10 m");

// General public API: 60 per minute per IP
export const apiLimiter = limiter(60, "1 m");
