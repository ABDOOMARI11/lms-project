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
import { getAllOrdersService } from "../services/order.ser";
import { redis } from "../Utils/redis";
import NotificationModel from "../models/notification.model";

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// create order
export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, payment_info } = req.body as IOrder;

    if (payment_info) {
      if ("id" in payment_info) {
        const paymentIntentId = payment_info.id;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
          return next(new ErrorHandler("Payment not authorized!", 400));
        }
      }
    }

    const user = await userModel.findById(req.user?._id);
    const courseExisteInUser = user?.courses.some((course: any) => course._id.toString() === courseId);

    if (courseExisteInUser) {
      return next(new ErrorHandler("You have already purchased this course", 400));
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
    await redis.set(req.user?._id, JSON.stringify(user));

    await user?.save();
    if (user) {
      await notificatModel.create({
        user: user._id,
        title: "new order",
        message: `you have a new order from ${course?.name}`,
      });
    }

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
      await sendMail({
        email: user?.email,
        subject: "Order Confirmation",
        template: "order-confirmation.ejs",
        data: MailData,
      });
    }

    const newOrder = await OrderModel.create(data);

    res.status(201).json({ order: newOrder });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const creerOrdre = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {});

// get All orders --- only for admin
export const getAllOrders = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    getAllOrdersService(res);
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// send stripe publishable key
export const sendStripePublishableKey = CatchAsyncError(async (req: Request, res: Response) => {
  res.status(200).json({
    publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// new payment
export const newPayment = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "MAD",
      metadata: {
        company: "DAcademy",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(201).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// create manual order
export const createManualOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return next(new ErrorHandler("User ID and Course ID are required", 400));
    }

    const user = await userModel.findById(userId);
    const course = await CourseModel.findById(courseId);

    if (!user || !course) {
      return next(new ErrorHandler("User or Course not found", 404));
    }

    user.courses.push(course._id);
    await user.save();

    const newOrder = await OrderModel.create({ user: userId, course: courseId, payment_info: "manual" });

    res.status(201).json({
      success: true,
      order: newOrder,
    });
  } catch (error: any) {
    console.error("Error in createManualOrder:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});


