import mongoose from "mongoose";
import { chatRoomSchema, IChatRoom } from "./chatRoom";
import { IMessage, messageSchema } from "./message";
import { IUser, userSchema } from "./user";

export const User = mongoose.model<IUser>("User", userSchema);
export const Message = mongoose.model<IMessage>("Message", messageSchema);
export const ChatRoom = mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);
