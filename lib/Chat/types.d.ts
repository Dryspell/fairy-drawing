import type { NextApiResponse } from "next";
import type { ServerOptions } from "socket.io";
import { MessageData } from "../../src/components/Chat/Message";

export type NextApiResponseWithSocket = NextApiResponse & SocketResponse;

type SocketResponse = {
  socket: {
    server: Partial<ServerOptions> & {
      io: Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        MessageData
      >;
    };
  };
};

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "receive-message": (data: MessageData) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  "send-message": (data: MessageData) => void;
}

export interface InterServerEvents {
  ping: () => void;
  // "receive-message": (data: SocketData) => void;
}
