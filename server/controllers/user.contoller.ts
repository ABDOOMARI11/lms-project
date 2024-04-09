require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../Utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken"; // Importation correcte de jsonwebtoken
import ejs from "ejs";
import path from "path";
import sendMail from "../Utils/sendMail";


// Créer une interface pour les données de registration
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password }: IRegistrationBody = req.body;
        const isEmailExist = await userModel.findOne({ email });

        if (isEmailExist) {
            throw new ErrorHandler("Email already exists", 400);
        }

        const user: IRegistrationBody = {
            name,
            email,
            password,
        };

        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };

        try {
            console.log("User email:", user.email);

            await sendMail({
              email: user.email,
              subject: "Activate your Account",
              template: "activation-mail.ejs",
              data,
            });
            
            res.status(201).json({
                success: true,
                message: `Please check your email ${user.email} to activate your account`,
                activationToken: activationToken.token,
            });

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});



  interface IActivationToken{
    token:string;
    activationCode:string;
  }

  const createActivationToken = (user: { name: string; email: string }): IActivationToken => {
    // Génération d'un code d'activation aléatoire
    const activationCode = (1000 + Math.floor(Math.random() * 9000)).toString();
  
    // Création du jeton JWT
    const token = jwt.sign(
      { user, activationCode }, // Payload contenant l'utilisateur et le code d'activation
      process.env.ACTIVATION_SECRET as Secret, // Utilisation de process.env.ACTIVATION_SECRET
      { expiresIn: "5m" }
    );
  
    return { token, activationCode };
  };

