require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
import { json } from "stream/consumers";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

 //parse environemnet variables  to integrates with fallback values
  const accesTokenExpire = parseInt(
  process.env.ACCES_TOKEN_EXPIRE || "300",
  10
);

 const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

//options for cookies

export const accesTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accesTokenExpire * 60 * 60 * 1000),
  maxAge: accesTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};


export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accesToken = user.SignAccesToken();
  const refreshToken = user.SignRefreshToken();

  // upload session to redis
  redis.set(user._id, JSON.stringify(user) as any);

 
  //only set secure to true in production

  if (process.env.NODE_ENV === "production") {
    accesTokenOptions.secure = true;
  }

  res.cookie("access_token", accesToken, accesTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accesToken,
  });
};
