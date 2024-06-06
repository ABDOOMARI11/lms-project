import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage(); // Utilisez memoryStorage ou diskStorage selon vos besoins
const upload = multer({ storage: storage });

// Middleware pour gérer les uploads de fichiers
export const uploadMiddleware = upload.single("thumbnail"); // ou upload.fields([{ name: 'thumbnail', maxCount: 1 }]) pour plusieurs fichiers
