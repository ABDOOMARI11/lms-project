import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";


const analyticsRouter = express.Router();



export default analyticsRouter;
