import { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  image?: string;
  roomId: string;
  status: "active" | "deleted";
  text: string;
  userId: string;
  seenBy: string[];
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
    seenBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);
