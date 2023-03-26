import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";
import type { MessageData } from "../../src/components/Chat/Message";

export async function socketInitializer(
  chatId: string,
  setAllMessages: React.Dispatch<React.SetStateAction<MessageData[]>>,
  setSocket: React.Dispatch<
    React.SetStateAction<Socket<
      ServerToClientEvents,
      ClientToServerEvents
    > | null>
  >
) {
  await fetch(`/api/chat/socket?chatId=${chatId}`);

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

  console.log(`connected to ${chatId}`);

  socket.on(
    "receive-message",
    (data: Parameters<ServerToClientEvents["receive-message"]>[0]) => {
      setAllMessages((pre) => [...pre, data]);

      console.log(`[Message] ${data.messageId}: ${data.text}`);
    }
  );
  setSocket(socket);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const origin = () =>
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";
