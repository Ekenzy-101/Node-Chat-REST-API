import { NextFunction, Request, Response } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).send("Unauthorized");

  return next();
};
