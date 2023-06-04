import type { NextApiRequest } from "next";
import { Server } from "socket.io";
import type { ServerOptions } from "socket.io";
import type {
  ClientToServerEvents,
  InterServerEvents,
  Message,
  NextApiResponseWithSocket,
  ServerToClientEvents,
} from "../../../../lib/Chat/types";

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  console.log(`Socket request for ChatId:${String(req.query.chatId)}`);

  if (res.socket.server.io) {
    console.log("Server already established");
    res.end();
    return;
  }

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    Message
  >(res.socket.server as Partial<ServerOptions>);

  res.socket.server.io = io;

  console.log(`Established Server, ${io.sockets.adapter.rooms.size} rooms`);

  io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    socket.on("send-message", (obj) => {
      console.log("Received message", obj);

      io.emit("receive-message", obj);
    });
  });

  console.log("Finished setting up Server");
  res.end();
}
