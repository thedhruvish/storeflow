import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const mongodbURL = process.env.MONGO_URL;
  if (!mongodbURL) {
    throw new Error("add Mongodb Url in env file");
  }

  mongoose.set("bufferCommands", false);

  await mongoose.connect(mongodbURL, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  console.log("MongoDB connected");
};
