import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../Utils/ErrorHandler";
import layoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// Create layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, image, title, subTitle, faq, categories } = req.body;
      const isTypeExists = await layoutModel.findOne({ type });
      if (isTypeExists) {
        return next(new ErrorHandler(`${type} already exists`, 400));
      }

      if (type === "Banner") {
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        const banner = {
          type: "Banner",
          Banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            title,
            subTitle,
          },
        };

        await layoutModel.create(banner);
      } else if (type === "FAQ") {
        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));

        await layoutModel.create({ type: "FAQ", FAQ: faqItems });
      } else if (type === "categories") {
        const categoriesItems = categories.map((item: any) => ({
          title: item.title,
        }));

        await layoutModel.create({
          type: "categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, image, title, subTitle, FAQ, categories } = req.body;

      if (type === "Banner") {
        const bannerData: any = await layoutModel.findOne({ type: "Banner" });
        if (
          bannerData &&
          bannerData.Banner.image &&
          bannerData.Banner.image.public_id
        ) {
          await cloudinary.v2.uploader.destroy(
            bannerData.Banner.image.public_id
          );
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        const banner = {
          Banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            title,
            subTitle,
          },
        };

        await layoutModel.findOneAndUpdate({ type: "Banner" }, banner);
      } else if (type === "FAQ") {
        // Mettre à jour les données FAQ
        await layoutModel.findOneAndUpdate({ type: "FAQ" }, { FAQ });    
        } else if (type === "categories") {
        const categoriesItems = categories.map((item: any) => ({
          title: item.title,
        }));

        await layoutModel.findOneAndUpdate(
          { type: "categories" },
          { categories: categoriesItems }
        );
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// Get layout by type
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.query;

      if (typeof type !== "string") {
        return next(new ErrorHandler("Invalid type parameter", 400));
      }

      console.log("Requested type:", type); // Ajout de log pour vérifier le type demandé

      const layout = await layoutModel.findOne({ type });
      
      if (!layout) {
        return next(new ErrorHandler("Layout not found", 404));
      }

      console.log("Fetched layout:", layout); // Ajout de log pour vérifier les données récupérées

      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
