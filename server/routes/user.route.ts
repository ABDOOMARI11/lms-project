import express from "express";
import {
  activateUser,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccesToken,
  getUserInfo,
  updateNameAndEmail, // Importer la fonction updateNameAndEmail depuis le contrôleur
  updatePassword,
  updateProfilePicture
   // Importer la fonction updatePassword depuis le contrôleur
} from "../controllers/user.contoller"; // Assurez-vous que le chemin d'accès au contrôleur est correct
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const UserRouter = express.Router();

UserRouter.post("/registration", registrationUser);
UserRouter.post("/activate-user", activateUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/logout", isAuthenticated, logoutUser);
UserRouter.get("/refresh", updateAccesToken);
UserRouter.get("/me", isAuthenticated, getUserInfo);
UserRouter.post("/social-auth", socialAuth);
// Route pour mettre à jour le nom et l'email de l'utilisateur
UserRouter.put("/update-name-email", isAuthenticated, updateNameAndEmail);
// Route pour mettre à jour le mot de passe de l'utilisateur
UserRouter.put("/update-password", isAuthenticated, updatePassword);
UserRouter.put("/update-profile", isAuthenticated, updateProfilePicture);

export default UserRouter;
