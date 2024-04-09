import express from "express";
import { registrationUser } from "../controllers/user.contoller";


const UserRouter = express.Router();

UserRouter.post('/registration',registrationUser);


export default UserRouter;