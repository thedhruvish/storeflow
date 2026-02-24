import serverless from "serverless-http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { getRedisClient } from "./config/redis-client.js";

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  await getRedisClient();
  return serverless(app)(event, context);
};
