import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../Utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs, { name } from "ejs";
import sendMail from "../Utils/sendMail";
import notificatModel from "../models/notification.model";

//create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      const user = await userModel.findById(req.user?._id);
      const courseExisteInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExisteInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course?._id,
        userId: user?._id,
        payment_info,
      };

      user?.courses.push(course?._id);
      await user?.save();
      if (user) {
        await notificatModel.create({
          user: user._id,
          title: "new order",
          message: `you have a new order from ${course?.name}`,
        });
      }


  

      // Incrémenter le nombre de commandes achetées pour le cours
      course.purchased = (course.purchased || 0) + 1;
      await course?.save();

        const MailData = {
    order: {
      _id: course._id.toString(),
      name: course.name,
      price: course.price,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
    },
  };
  if (user) {
    // Envoyer un e-mail de confirmation de commande à l'utilisateur
    await sendMail({
      email: user?.email,
      subject: "Order Confirmation",
      template: "order-confirmation.ejs",
      data: MailData,
    });
  }

      // Créer une nouvelle commande et renvoyer la réponse
      const newOrder = await OrderModel.create(data);

      res.status(201).json({ order: newOrder });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const creerOrdre = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{

});

export const getAllOrders = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const orders = await OrderModel.find().sort({createdAt: -1});
    res.status(200).json({
      success:true,
      orders,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});