import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../Utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken"; // Correction de l'importation de jsonwebtoken
import { redis } from "../Utils/redis";

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      throw new ErrorHandler("User is not Authenticated", 400);
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    if (!decoded || !decoded.id) {
      throw new ErrorHandler("Access Token is Not valid", 400);
    }

    const user = await redis.get(decoded.id);
    if (!user) {
      throw new ErrorHandler("User not found", 400);
    }

    req.user = JSON.parse(user.toString());
    next();
  }
);

//validate user roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
        return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to this ressource`,401));

    }
    next();
  };
};
