import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import { connectToDatabase } from "./app/database";
import { regiterRoutes } from "./app/route";
import {
  registerAfterRouteMiddlewares,
  registerBeforeRouteMiddlewares,
} from "./app/middleware";
import { CLIENT_ORIGIN } from "./config";
import { listenForWebSocketConnection } from "./app/websocket";

const start = async () => {
  try {
    const app = express();
    const port = process.env.PORT || 5000;
    await connectToDatabase();

    registerBeforeRouteMiddlewares(app);
    regiterRoutes(app);
    registerAfterRouteMiddlewares(app);

    const server = http.createServer(app);

    const io = new Server(server, {
      cookie: true,
      cors: { origin: CLIENT_ORIGIN, credentials: true },
    });

    listenForWebSocketConnection(io);

    server.listen(port, () => console.log(`Running on port ${port}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
