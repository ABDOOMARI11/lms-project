import express from "express";
import {

  addQuestion,
  addReplyToReview,
  addReview,
  ajouterAnswers,
  deleteCourse,
  editCourse,
  getAllCourses,
  getAllLessouns,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
  getAdminAllCourses,
  generateVideoUrl,
   getVideoUrl
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccesToken } from "../controllers/user.contoller";

const CourseRouter = express.Router();

CourseRouter.post(
  "/create-course",
  updateAccesToken,
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);
CourseRouter.put(
  "/edit-course/:id",
  updateAccesToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
CourseRouter.get("/get-course/:id", getSingleCourse);

CourseRouter.get("/get-courses",getAllCourses);
                                               
CourseRouter.get("/get-course-content/:id",updateAccesToken,isAuthenticated,getCourseByUser);
CourseRouter.put("/add-question", updateAccesToken,isAuthenticated,addQuestion);
CourseRouter.put("/add-answer", updateAccesToken,isAuthenticated,ajouterAnswers);
CourseRouter.put("/add-review/:id", updateAccesToken,isAuthenticated,addReview);
CourseRouter.put("/add-reply", updateAccesToken,isAuthenticated,  authorizeRoles("admin"),addReplyToReview);
CourseRouter.get("/all-courses-admin",updateAccesToken,isAuthenticated,  authorizeRoles("admin"),getAllLessouns);
CourseRouter.delete("/delete-course/:id",updateAccesToken,isAuthenticated,  authorizeRoles("admin"),deleteCourse);
CourseRouter.post("/getVideoUrl", getVideoUrl);


export default CourseRouter;
