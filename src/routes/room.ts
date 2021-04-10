import { Request, Response, Router } from "express";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { validateUserId } from "../middlewares/validation";
import { getValidationErrors } from "../utils/validation";
import { routerAuth } from "../middlewares/auth";
import { ChatRoom, User } from "../models";

const router = Router();

router.get("/", routerAuth, async (req: Request, res: Response) => {
  const rooms = await ChatRoom.find({ users: req.user?._id })
    .populate({ path: "messages", options: { sort: { createdAt: -1 } } })
    .populate({ path: "users", select: "-password" });
  res.send(rooms);
});

router.post(
  "/",
  routerAuth,
  validateUserId,
  async (req: Request<any, any, { userId: string }>, res: Response) => {
    const errors = getValidationErrors(req);
    if (Object.keys(errors).length) return res.status(400).send(errors);

    const { userId } = req.body;
    const authUser = req.user;
    if (userId === authUser?._id)
      return res
        .status(400)
        .send({ userId: "You cannot create a room with your id" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ userId: "User not found" });

    const userIds = [userId, authUser?._id];
    let room = await ChatRoom.findOne({ users: userIds });
    if (room)
      return res
        .status(400)
        .send({ userId: "Room has been created for you and this user" });

    room = await ChatRoom.create({
      users: userIds,
      messages: [],
    });
    room = await room.populate("users").execPopulate();

    const io = req.app.get("io") as Server<DefaultEventsMap, DefaultEventsMap>;
    const allSockets = await io.fetchSockets();

    const roomSockets = allSockets.filter((s) =>
      userIds.includes(s.handshake.query.userId)
    );
    roomSockets.forEach((s) => s.join(`room:${room?._id}`));
    io.to(`room:${room?._id}`).emit("newRoom", room);

    return res.send("");
  }
);

export default router;
