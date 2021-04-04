import { NextFunction, Request, Response } from "express";

export default (err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid Token");
  } else {
    next(err);
  }
};
