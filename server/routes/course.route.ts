import express from "express";
import {

  addQuestion,
  ajouterAnswers,
  editCourse,
  getAllCourses,
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

export default CourseRouter;
