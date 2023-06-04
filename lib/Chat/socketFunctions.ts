import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";
import type { Message } from "@prisma/client";

export async function InitializeChatSocket(
  chatRoomId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setSocket: React.Dispatch<
    React.SetStateAction<Socket<
      ServerToClientEvents,
      ClientToServerEvents
    > | null>
  >
) {
  await fetch(`/api/chat/socket?chatId=${chatRoomId}`);

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

  console.log(`connected to ${chatRoomId}`);

  socket.on(
    "receive-message",
    (data: Parameters<ServerToClientEvents["receive-message"]>[0]) => {
      setMessages((pre) => [...pre, data]);

      console.log(`[Message] ${data.messageId}: ${data.text}`);
    }
  );
  setSocket(socket);
}

export function socketSubmitMessage(
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null,
  message: Message
) {
  if (!socket) {
    console.log("socket not initialized");
    return;
  }

  console.log(`Submitted Message to Socket: ${message.text}`);

  socket.emit("send-message", message);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const origin = () =>
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";
