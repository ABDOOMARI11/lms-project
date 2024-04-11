import { Redis } from "ioredis";
require("dotenv").config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log(`Redis Connected`);
        return process.env.REDIS_URL;
    }
    throw new Error('Redis connection failed');
};

// Initialize Redis client
export const redis = new Redis(redisClient());

// Now you can use the `redis` variable elsewhere in your code
