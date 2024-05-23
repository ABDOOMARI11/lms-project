require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../Utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret, JwtPayload } from "jsonwebtoken"; // Importation correcte de jsonwebtoken
// import ejs from "ejs";
// import path from "path";
import sendMail from "../Utils/sendMail";
import cloudinary from "cloudinary";
import {
  accesTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../Utils/jwt";
import { redis } from "../Utils/redis";
import { getAllUsers, getUserById } from "../services/user.ser";
import bcrypt from "bcryptjs";
import { json } from "stream/consumers";

// Créer une interface pour les données de registration
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
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
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

const createActivationToken = (user: {
  name: string;
  email: string;
}): IActivationToken => {
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

//activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("invalid activation code ", 400));
      }
      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("Email already exists ", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.json({
        succes: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//login user
interface ILoginRequest {
  email: string;
  password: string;
}
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(new ErrorHandler("please enter email and password", 400));
      }
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      const isPasswordMatches = user.comparePassword(password);
      if (!isPasswordMatches) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Supprimer l'utilisateur du cache Redis
      const access_token = req.cookies.access_token;
      if (!access_token) {
        throw new ErrorHandler("User is not Authenticated", 400);
      }

      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;
      if (!decoded || !decoded.id) {
        throw new ErrorHandler("Access Token is Not valid", 400);
      }

      await redis.del(decoded.id); // Supprimer l'utilisateur du cache Redis

      // Effacer les cookies d'authentification
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      res.status(200).json({
        success: true,
        message: "logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//update acces token

export const updateAccesToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "could not refresh token ";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(
          new ErrorHandler("please login to acces this resource", 400)
        );
      }
      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCES_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );
      req.user = user;

      res.cookie("access_token", accessToken, accesTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);
      await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7 days

      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar?: string; // Avatar facultatif
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar, password } = req.body;

      if (!email || !name) {
        throw new Error("Email and name are required.");
      }

      const userAvatar = avatar ? { public_id: "", url: avatar } : undefined;

      // Créer un nouvel utilisateur avec le mot de passe haché
      const newUser = await userModel.create({
        email,
        name,
        password,
        avatar: userAvatar,
      });

      // Envoyer le token avec le nouvel utilisateur créé
      sendToken(newUser, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdateUserInfo {
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  oldPassword?: string | undefined;
  newPassword?: string | undefined;
}

export const updateNameAndEmail = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id; // Récupérer l'ID de l'utilisateur connecté depuis la demande

      console.log("UserID:", userId); // Afficher la valeur de userId

      // Récupérer les nouvelles données utilisateur à partir du corps de la demande
      const { name, email }: IUpdateUserInfo = req.body;

      console.log("New Name:", name); // Afficher la valeur de name
      console.log("New Email:", email); // Afficher la valeur de email

      // Vérifier s'il y a un ID utilisateur dans la demande
      if (!userId) {
        throw new ErrorHandler("User ID not found", 400);
      }

      // Mettre à jour les informations utilisateur si elles sont fournies dans la demande et non vides
      const updateFields: any = {};
      if (name !== undefined && name !== "") {
        updateFields.name = name;
      }
      if (email !== undefined && email !== "") {
        updateFields.email = email;
      }

      // Mettre à jour les informations de l'utilisateur dans la base de données MongoDB
      await userModel.updateOne({ _id: userId }, { $set: updateFields });

      // Mettre à jour les informations utilisateur dans Redis
      const updatedUser = await userModel.findById(userId);
      await redis.set(userId, JSON.stringify(updatedUser));
      // Répondre avec un succès
      res.status(200).json({
        success: true,
        message: "User information updated successfully",
      });
    } catch (error: any) {
      console.error("Update Name and Email Error:", error.message);
      console.error(error); // Afficher l'erreur complète pour un débogage supplémentaire

      // Vérifier si l'erreur est liée à bcrypt.hash
      if (error.message.includes("bcrypt.hash")) {
        return next(new ErrorHandler("Password error", 400));
      }

      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id; // Récupérer l'ID de l'utilisateur connecté depuis la demande

      console.log("UserID:", userId);

      // Récupérer les anciennes et nouvelles données utilisateur à partir du corps de la demande
      const {
        oldPassword,
        newPassword,
      }: { oldPassword: string; newPassword: string } = req.body;

      console.log("Old Password Entered:", oldPassword);
      console.log("New Password Entered:", newPassword);

      // Vérifier s'il y a un ID utilisateur dans la demande
      if (!userId) {
        throw new ErrorHandler("User ID not found", 400);
      }

      // Recherche de l'utilisateur dans la base de données avant la mise à jour
      const userBeforeUpdate = await userModel
        .findById(userId)
        .select("+password");

      // Vérifier si l'utilisateur existe dans la base de données
      if (!userBeforeUpdate) {
        throw new ErrorHandler("User not found", 404);
      }

      console.log("Password Stored in Database:", userBeforeUpdate.password);

      // Comparer les mots de passe
      if (oldPassword !== userBeforeUpdate.password) {
        throw new ErrorHandler("Old password is incorrect", 400);
      }

      // Mettre à jour le mot de passe
      userBeforeUpdate.password = newPassword;

      // Enregistrer les modifications dans la base de données
      await userBeforeUpdate.save();

      // Mettre à jour les informations utilisateur dans Redis
      await redis.set(userId, JSON.stringify(userBeforeUpdate));

      // Répondre avec les informations utilisateur mises à jour
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      console.error("Update Password Error:", error.message);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Interface pour les paramètres de mise à jour de l'avatar
interface IUpdateProfile {
  avatar: string;
}

export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (avatar && user) {
        //if we have any avatar the cal this if  block
        if (user?.avatar.public_id) {
          //first delete the old image
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.url,
          };
        }
      }

      await user?.save();
      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//get all users
export const getAllUsersForAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsers(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user role  --- only for admin

export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("Utilisateur non trouvé", 404));
      }

      user.role = role;
      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete user ---only for admin

export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);
      if (!user) {
        return next(new ErrorHandler("user not found", 404));
      }
      await user.deleteOne({ id });
      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "user deleted succesfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
