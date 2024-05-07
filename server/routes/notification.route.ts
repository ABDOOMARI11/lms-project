import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { getNotifications, updatenotificationStatus } from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);

notificationRouter.put("/update-notification/:id",
isAuthenticated,
authorizeRoles("admin"),
updatenotificationStatus)


export default notificationRouter;