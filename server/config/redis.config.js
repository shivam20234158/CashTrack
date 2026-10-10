import { Redis } from "@upstash/redis";

let redisClient = null;
const memoryBlacklist = new Map(); // token -> expiryTimestampMs

// Clean up expired tokens in memory fallback periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of memoryBlacklist.entries()) {
    if (expiry <= now) {
      memoryBlacklist.delete(token);
    }
  }
}, 60 * 1000);

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log("Upstash Redis configured successfully");
  } catch (error) {
    console.warn("Failed to initialize Upstash Redis client, using fallback:", error.message);
  }
} else {
  console.log("Upstash Redis credentials not found in env, using in-memory token blacklist fallback");
}

/**
 * Add a token to the blacklist with a time-to-live in seconds
 * @param {string} token - The raw JWT token string
 * @param {number} expiryInSeconds - Time to live in seconds
 */
export const blacklistToken = async (token, expiryInSeconds = 7 * 24 * 3600) => {
  const ttl = Math.max(Math.floor(expiryInSeconds), 1);
  const key = `blacklist:${token}`;

  if (redisClient) {
    try {
      await redisClient.set(key, "revoked", { ex: ttl });
      return true;
    } catch (err) {
      console.error("Upstash Redis set error, falling back to in-memory:", err.message);
    }
  }

  // Fallback to memory
  memoryBlacklist.set(token, Date.now() + ttl * 1000);
  return true;
};

/**
 * Check if a token is in the blacklist
 * @param {string} token - The raw JWT token string
 * @returns {Promise<boolean>}
 */
export const isTokenBlacklisted = async (token) => {
  const key = `blacklist:${token}`;

  if (redisClient) {
    try {
      const result = await redisClient.get(key);
      if (result) return true;
    } catch (err) {
      console.error("Upstash Redis get error, falling back to in-memory:", err.message);
    }
  }

  // Fallback to memory
  const expiry = memoryBlacklist.get(token);
  if (expiry) {
    if (expiry > Date.now()) {
      return true;
    }
    memoryBlacklist.delete(token);
  }

  return false;
};

export default {
  blacklistToken,
  isTokenBlacklisted,
};
