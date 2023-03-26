import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  MessageData,
  ServerToClientEvents,
} from "./types";
import { faker } from "@faker-js/faker";
import type { User } from "@prisma/client";

export async function socketInitializer(
  chatRoomId: string,
  setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>,
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
  message: MessageData
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

export const createMessageFromPlainText = (input: {
  text: string;
  roomId: string;
  username?: string;
  name?: string;
  user?: User | null;
}): MessageData => {
  const message: MessageData = {
    messageId: faker.datatype.uuid(),
    roomId: String(input.roomId),
    text: input.text,
    author: {
      username: input.user?.email || input.username || "Anonymous",
      name: input.user?.name || input.name || input.username || "Anonymous",
      image: faker.internet.avatar() || "",
    },
    postedAt: new Date().toLocaleDateString(),
    replies: [],
  };
  return message;
};
