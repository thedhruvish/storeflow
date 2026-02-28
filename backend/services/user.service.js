import User from "../models/User.model.js";
import { deleteRedisKey } from "./redis.service.js";

export const updateUserInfo = async (userId, update) => {
  const [user, _] = await Promise.all([
    User.findByIdAndUpdate(userId, update, { new: true }),
    deleteRedisKey(`user:${userId}`),
  ]);
  return user;
};
