import { Message } from "@prisma/client";
import type { NextApiResponse } from "next";
import type { ServerOptions } from "socket.io";

export type NextApiResponseWithSocket = NextApiResponse & SocketResponse;

type SocketResponse = {
  socket: {
    server: Partial<ServerOptions> & {
      io: Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        Message
      >;
    };
  };
};

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "receive-message": (data: Message) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  "send-message": (data: Message) => void;
}

export interface InterServerEvents {
  ping: () => void;
  // "receive-message": (data: SocketData) => void;
}
