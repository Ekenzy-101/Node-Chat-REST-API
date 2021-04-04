import cookieParser from "cookie-parser";
import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import jwt from "express-jwt";

import { APP_ACCESS_SECRET, CLIENT_ORIGIN } from "../config";
import tokenError from "../middlewares/tokenError";

export const registerBeforeRouteMiddlewares = (app: Express) => {
  app.use(helmet({}));
  app.use(cors({ credentials: true, origin: CLIENT_ORIGIN }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    jwt({
      secret: APP_ACCESS_SECRET,
      getToken: (req) => req.cookies["access_token"],
      credentialsRequired: false,
      algorithms: ["HS256"],
    })
  );
};

export const registerAfterRouteMiddlewares = (app: Express) => {
  app.use(tokenError);
};
