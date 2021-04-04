import jwt from "jsonwebtoken";
import mongoose, { Document, Schema } from "mongoose";
import { APP_ACCESS_SECRET } from "../config";

export interface IUser extends Document {
  email: string;
  image: string;
  name: string;
  password: string;
  generateAccessToken: (expiresIn?: string) => string;
}

const userSchema: Schema = new Schema(
  {
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function (expiresIn = "1 day") {
  const { email, _id } = this as IUser;

  return jwt.sign(
    {
      email,
      _id,
    },
    APP_ACCESS_SECRET,
    { expiresIn }
  );
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
