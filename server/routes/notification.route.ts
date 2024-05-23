import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { getNotifications, updatenotificationStatus } from "../controllers/notification.controller";
import { updateAccesToken } from "../controllers/user.contoller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  updateAccesToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);

notificationRouter.put("/update-notification/:id",
isAuthenticated,
updateAccesToken,
authorizeRoles("admin"),
updatenotificationStatus)


export default notificationRouter;