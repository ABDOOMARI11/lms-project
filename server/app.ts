require("dotenv").config();
import express from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
// import {router} from "./routes";
import { Request, Response, NextFunction } from "express";
import { ErrorMiddleware } from "./middleware/error";
import UserRouter from "./routes/user.route";
import CourseRouter from "./routes/course.route";

const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//cookie parser

app.use(cookieParser());

//cors => cross origin resource sharing

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use("/api/v1", UserRouter);
app.use("/api/v1", CourseRouter);

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

app.use(ErrorMiddleware);
