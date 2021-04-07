import { Request } from "express";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { socketAuth } from "../middlewares/auth";
import { ChatRoom, Message } from "../models";

export const listenForWebSocketConnection = (
  io: Server<DefaultEventsMap, DefaultEventsMap>
) => {
  io.use(socketAuth);
  io.on("connection", async (socket: Socket) => {
    const request = socket.request as Request;
    const authUser = request.user;

    const rooms = await ChatRoom.find({ users: authUser?._id });
    rooms.forEach(async (r) => await socket.join(`room:${r._id}`));

    socket.on("sendMessage", async ({ text, roomId }) => {
      const message = await Message.create({
        text,
        roomId,
        userId: authUser?._id,
        seenBy: [authUser?._id],
      });

      await ChatRoom.findOneAndUpdate(
        { _id: roomId },
        { $push: { messages: message._id } }
      );

      io.to(`room:${roomId}`).emit("newMessage", message);
    });

    socket.on(
      "seenMessages",
      async ({
        messageIds,
        roomId,
      }: {
        messageIds: string[];
        roomId: string;
      }) => {
        if (messageIds.length) {
          await Message.updateMany(
            { _id: messageIds },
            { $addToSet: { seenBy: authUser?._id } }
          );

          const roomSockets = await io.in(`room:${roomId}`).fetchSockets();
          const room = await ChatRoom.findById(roomId, "users");
          const otherUserId = room?.users.find((id) => id !== authUser?._id);

          const otherUserSocketIds = roomSockets
            .filter((s) => s.handshake.query.userId === otherUserId)
            .map((s) => s.id);

          io.to(otherUserSocketIds).emit("otherUserHasSeenMessages", roomId);

          io.to(`room:${roomId}`).emit("allUsersHaveSeenMessages", roomId);
        }
      }
    );
  });
};
