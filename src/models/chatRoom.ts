import { Document, Schema } from "mongoose";
import { IMessage } from "./message";

export interface IChatRoom extends Document {
  users: string[];
  messages: IMessage[];
}

export const chatRoomSchema: Schema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);
