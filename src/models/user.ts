import jwt from "jsonwebtoken";
import { Document, Schema } from "mongoose";
import { APP_ACCESS_SECRET } from "../config";

export interface IUser extends Document {
  email: string;
  image: string;
  name: string;
  password: string;
  generateAccessToken: (expiresIn?: string) => string;
}

export const userSchema: Schema = new Schema(
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
  const { email, _id, name } = this as IUser;

  return jwt.sign(
    {
      email,
      _id,
      name,
    },
    APP_ACCESS_SECRET,
    { expiresIn }
  );
};
