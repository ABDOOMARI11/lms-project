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
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const CourseRouter = express.Router();

CourseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);
CourseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
CourseRouter.get("/get-course/:id", getSingleCourse);

CourseRouter.get("/get-all-courses", getAllCourses);
CourseRouter.get("/get-course-content/:id",isAuthenticated,getCourseByUser);
CourseRouter.put("/add-question",isAuthenticated,addQuestion);
CourseRouter.put("/add-answer",isAuthenticated,ajouterAnswers);
CourseRouter.put("/add-review/:id",isAuthenticated,addReview);
CourseRouter.put("/add-reply-review",isAuthenticated,  authorizeRoles("admin"),addReplyToReview);
CourseRouter.get("/all-courses-admin",isAuthenticated,  authorizeRoles("admin"),getAllLessouns);
CourseRouter.delete("/delete-course/:id",isAuthenticated,  authorizeRoles("admin"),deleteCourse);


export default CourseRouter;
