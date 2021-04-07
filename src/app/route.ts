import { Express } from "express";
import authRouter from "../routes/auth";
import roomsRouter from "../routes/room";

export const regiterRoutes = (app: Express) => {
  app.use("/api/auth", authRouter);
  app.use("/api/rooms", roomsRouter);
};
