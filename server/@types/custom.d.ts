import { Request } from "express";
import { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      file?: Express.Multer.File;
      files?: { [fieldname: string]: Express.Multer.File[] };
    }
  }
}
