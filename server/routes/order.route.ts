import express from "express";
import { isAuthenticated,authorizeRoles } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { updateAccesToken } from "../controllers/user.contoller";



const orderRouter = express.Router();

orderRouter.get("/all-ordres-admin",updateAccesToken,isAuthenticated,  authorizeRoles("admin"),getAllOrders);

orderRouter.post("/create-order", updateAccesToken,isAuthenticated, createOrder);


export default orderRouter;