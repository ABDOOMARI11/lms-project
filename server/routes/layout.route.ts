import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";
import { updateAccesToken } from "../controllers/user.contoller";

const layoutRouter = express.Router();

layoutRouter.post("/create-layout",updateAccesToken,isAuthenticated,authorizeRoles("admin"),createLayout);
layoutRouter.put("/edit-layout",updateAccesToken,isAuthenticated,authorizeRoles("admin"),editLayout);
layoutRouter.get("/get-layout",getLayoutByType);

export default layoutRouter;