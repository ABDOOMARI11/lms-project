import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getCoursesAnalytics,
  getOrderAnalytics,
  getUsersAnalytics,
} from "../controllers/analytics.controller";
import { updateAccesToken } from "../controllers/user.contoller";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  updateAccesToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getUsersAnalytics
);

analyticsRouter.get(
  "/get-orders-analytics",
  updateAccesToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getOrderAnalytics
);

analyticsRouter.get(
  "/get-courses-analytics",
  updateAccesToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesAnalytics
);

export default analyticsRouter;
