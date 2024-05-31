import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../Utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.ser";
import CourseModel from "../models/course.model";
import { redis } from "../Utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../Utils/sendMail";
import notificatModel from "../models/notification.model";
import axios from "axios";
import { google } from 'googleapis';
// upload course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
           url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//edit course
export const editCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;

    // Only attempt to destroy and upload thumbnail if it contains a public_id
    if (thumbnail && thumbnail.public_id) {
      await cloudinary.v2.uploader.destroy(thumbnail.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const courseId = req.params.id;
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      { $set: data },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
};

//get single course ------------------ without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const course = await CourseModel.findById(courseId).select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 days

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);
//get all courses ------------------ without purchasing


// Supprimer le cache avant d'appeler getAllCourses
const deleteAllCoursesCache = async () => {
  await redis.del("allCourses");
};

// Obtenez tous les cours sans achat
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Supprimer le cache avant d'appeler getAllCourses
      await deleteAllCoursesCache();
      
      const isCacheExiste = await redis.get("allCourses");

      if (isCacheExiste) {
        const courses = JSON.parse(isCacheExiste);
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


export const getAdminAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// get course content -------> for valid users

export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );
      if (!courseExists) {
        return next(
          new ErrorHandler("you are not eligible to acces this course ", 404)
        );
      }
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//add questions to a course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content id ", 400));
      }
      const CourseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!CourseContent) {
        return next(new ErrorHandler("Invalid Content", 400));
      }
      //create new
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };
      //add this question to our course content
      CourseContent.questions.push(newQuestion);

      await notificatModel.create({
        user: req.user?._id,
        title: "new question received",
        message: `you have a new question in ${CourseContent.title}`,
      });

      //save the updated course
      await course?.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const ajouterAnswers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("invalid content", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("invalid content id ", 400));
      }
      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("invalid question ", 400));
      }

      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionReplies.push(newAnswer);
      await course?.save();

    
        await notificatModel.create({
          user: req.user?._id,
          title: "new question reply  received",
          message: `you have a new question reply in ${courseContent.title}`,
        });      
      const data = {
        userName: question.user.name,
        courseTitle: courseContent.title,
      };

      await sendMail({
        email: question.user.email,
        subject: "Reply your Question",
        template: "question-reply.ejs",
        data,
      });
      console.log(answer);
      console.log(courseId);
      console.log(contentId);
      console.log(questionId);

      res.status(200).json({
        success: true,
        message: "les valeurs sont affichees",
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//add review to a course
interface IReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCoursesList = req.user?.courses;
      const courseId = req.params.id;

      const courseExiste = userCoursesList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );
      if (!courseExiste) {
        return next(
          new ErrorHandler("you're not eligibale to acces this course ", 404)
        );
      }
      const course = await CourseModel.findById(courseId);
      const { review, rating } = req.body as IReviewData;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };
      course?.reviews.push(reviewData);
      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length; // avarage of ratings
      }
      await course?.save();

      //create notification

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IAddReviewReplyData {
  comment: string;
  courseId: string;
  reviewId: string;
}
//add reply
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }
      const replyData: any = {
        user: req.user,
        comment,
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies?.push(replyData);

      await course?.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
export const getAllLessouns = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    getAllCoursesService(res);
    
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// delete course ---only for admin

export const  deleteCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
   const {id} = req.params;
   const course = await CourseModel.findById(id);
   if (!course) {
     return next(new ErrorHandler("course not found", 404));
   }
 await course.deleteOne({id});
 await redis.del(id);
 res.status(200).json({
   success:true,
   message:"course deleted succesfully",
 });
  } catch (error: any) {
   return next(new ErrorHandler(error.message, 400));
 }
 });


 // generate video url
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      // Assuming you have a method to get video info from the database
      const video = await getVideoFromDatabase(videoId);
      if (!video) {
        return next(new ErrorHandler("Video not found", 404));
      }
      res.json({ videoUrl: video.url });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// Example function to get video URL from the database
const getVideoFromDatabase = async (videoId: string) => {
  // Your logic to get video URL from the database
  // Return an object containing the video URL
  return { url: 'YOUTUBE_VIDEO_ID' };
};
