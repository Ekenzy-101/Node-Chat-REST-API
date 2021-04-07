import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { ACCESS_TOKEN_COOKIE_NAME, APP_ACCESS_SECRET } from "../config";
import { parseCookies } from "../utils/cookies";

export const routerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.status(401).send("Unauthorized");

  return next();
};

export const socketAuth = async (
  { handshake, request }: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  const err = new Error("Unauthorized");
  try {
    if (!handshake.headers.cookie) return next(err);

    const cookies = parseCookies(handshake.headers.cookie);
    const token = cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return next(err);

    const user = jwt.verify(token, APP_ACCESS_SECRET);
    (request as any).user = user;
    return next();
  } catch (error) {
    return next(err);
  }
};
