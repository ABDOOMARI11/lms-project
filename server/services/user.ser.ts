import { Response, NextFunction } from "express";
import { redis } from "../Utils/redis";
import userModel from "../models/user.model";

// getUserById function
export const getUserById = async (
  userId: string,
  res: Response,
  next: NextFunction
) => {
  const userJson = await redis.get(userId);

  if (!userJson) {
    // Handle case when user is not found in Redis
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const user = JSON.parse(userJson);

  res.status(200).json({ success: true, user });
};
// get all users
export const getAllUsers = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    users,
  });
};

//update user role

