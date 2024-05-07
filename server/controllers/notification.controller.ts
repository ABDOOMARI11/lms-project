import notificatModel from "../models/notification.model";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../Utils/ErrorHandler";
import OrderModel from "../models/order.model";
import cron  from "node-cron";

//get all notifications  --only for admin
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await notificatModel.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: "all notifications got successfully",
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update notification status 
export const updatenotificationStatus = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await notificatModel.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
        } else {
            notification.status = "read"; // Assurez-vous que la propriété 'status' est correctement assignée à "read"
        }
        await notification.save();
        const notifications = await notificatModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// delete notification -- only admin

cron.schedule("0 0 0 * * *",async()=>{
  const thirtyDayAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await notificatModel.deleteMany({status:"read",createdAt:{$lt: thirtyDayAgo}});
  console.log("deleted read notifications");
}); 
