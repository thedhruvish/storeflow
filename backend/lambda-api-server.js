import serverless from "serverless-http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import "./config/redis-client.js";

await connectDB();
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return serverless(app)(event, context);
};
