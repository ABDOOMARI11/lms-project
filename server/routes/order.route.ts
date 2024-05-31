import express from "express";
import { isAuthenticated,authorizeRoles } from "../middleware/auth";
import { createOrder, getAllOrders,newPayment,sendStripePublishableKey } from "../controllers/order.controller";
import { updateAccesToken } from "../controllers/user.contoller";



const orderRouter = express.Router();

// orderRouter.get("/all-ordres-admin",updateAccesToken,isAuthenticated,  authorizeRoles("admin"),getAllOrders);

orderRouter.post("/create-order", updateAccesToken,isAuthenticated, createOrder);

orderRouter.get(
    "/get-orders",
    updateAccesToken,
    isAuthenticated,
    authorizeRoles("admin"),
    getAllOrders
  );
  orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

orderRouter.post("/payment",updateAccesToken,isAuthenticated, newPayment);
export default orderRouter;