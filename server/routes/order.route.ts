import express from "express";
import { isAuthenticated,authorizeRoles } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";



const orderRouter = express.Router();

orderRouter.get("/all-ordres-admin",isAuthenticated,  authorizeRoles("admin"),getAllOrders);

orderRouter.post("/create-order", isAuthenticated, createOrder);


export default orderRouter;