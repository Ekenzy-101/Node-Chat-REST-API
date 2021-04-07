import { Request, Response, Router } from "express";
import { routerAuth } from "../middlewares/auth";
import { ChatRoom } from "../models";

const router = Router();

router.get("/", routerAuth, async (req: Request, res: Response) => {
  const rooms = await ChatRoom.find({ users: req.user?._id })
    .populate({ path: "messages", options: { sort: { createdAt: -1 } } })
    .populate({ path: "users", select: "-password" });
  res.send(rooms);
});

export default router;
