import { Redis } from "ioredis";

export const redisConnection = new Redis({
  username: process.env.REDIS_USER_NAME!,
  password: process.env.REDIS_DB_PASSWORD!,
  host: process.env.REDIS_HOST!,
  port: parseInt(process.env.REDIS_PORT!),
  maxRetriesPerRequest: null,
});
