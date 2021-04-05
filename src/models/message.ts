import { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  image?: string;
  roomId: string;
  status: "active" | "deleted" | "seen";
  text: string;
  userId: string;
}

export const messageSchema: Schema = new Schema(
  {
    image: {
      type: String,
      default: "",
    },
    roomId: {
      type: Schema.Types.ObjectId,
    },
    status: {
      type: String,
      default: "active",
    },
    text: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
