import { createClient } from "redis";

let redisClient = null;
let isConnecting = false;

export const getRedisClient = async () => {
  // Return existing connected client
  if (redisClient?.isReady) {
    return redisClient;
  }

  if (isConnecting) {
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return redisClient;
  }

  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined in environment variables");
  }

  isConnecting = true;

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 6000,
        commandTimeout: 6000,
        keepAlive: true,
        reconnectStrategy: (retries) => {
          if (retries > 3) return new Error("Max retries exceeded");
          return Math.min(retries * 100, 1000);
        },
      },
      disableOfflineQueue: true,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err.message);
    });

    redisClient.on("connect", () => {
      console.log("Redis connected");
    });

    redisClient.on("reconnecting", () => {
      console.log("Redis reconnecting...");
    });

    await redisClient.connect();
  } catch (error) {
    console.error("Redis connection failed:", error);
    redisClient = null;
    throw error;
  } finally {
    isConnecting = false;
  }
};

export default redisClient;
