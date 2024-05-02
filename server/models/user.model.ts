require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import Jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Rendre le mot de passe facultatif
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (enteredPassword: string) => Promise<boolean>; // Modifier la signature de la méthode
  SignAccesToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    avatar: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);


userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    return next();
  } catch (error:any) {
    return next(error);
  }
});

//sign acces token
userSchema.methods.SignAccesToken = function () {
  return Jwt.sign({ id: this._id }, process.env.ACCES_TOKEN || "",{
    expiresIn:"5m",
  });
};

//sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return Jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "",{
    expiresIn:"3d",
  });
};

userSchema.methods.comparePassword = function (enteredPassword: string) {
  // Vous pouvez utiliser une comparaison simple
  return enteredPassword === this.password;
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
