import { Express } from "express";
import authRouter from "../routes/auth";

export const regiterRoutes = (app: Express) => {
  app.use("/api/auth", authRouter);
};
