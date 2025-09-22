import { Queue } from "bullmq";

import { redisConnection } from "./lib.js";

export const messageQueue = new Queue("message", {
  connection: redisConnection,
});
