import type { NextApiRequest } from "next";
import { Server } from "socket.io";
import type { ServerOptions } from "socket.io";
import type {
  ClientToServerEvents,
  InterServerEvents,
  MessageData,
  NextApiResponseWithSocket,
  ServerToClientEvents,
} from "../../../../lib/Chat/types";

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    MessageData
  >(res.socket.server as Partial<ServerOptions>);

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("send-message", (obj) => {
      io.emit("receive-message", obj);
    });
  });

  console.log("Setting up socket");
  res.end();
}
