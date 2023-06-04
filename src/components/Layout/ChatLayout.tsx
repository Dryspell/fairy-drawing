import type { Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../lib/Chat/types";
import { InitializeChatSocket } from "../../../lib/Chat/socketFunctions";
import React from "react";
import { useRouter } from "next/router";
import { faker } from "@faker-js/faker";
import { Message } from "@prisma/client";

export const ChatContext = React.createContext({
  socket: null as Socket<ServerToClientEvents, ClientToServerEvents> | null,
  roomId: "",
  messages: [] as Message[],
  setMessages: (() => void 0) as React.Dispatch<
    React.SetStateAction<Message[]>
  >,
});

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [socket, setSocket] = React.useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const chatRoomId = router.query.chatId || faker.word.noun();

  if (!router.query.chatId)
    router
      .push(`?chatId=${String(chatRoomId)}`, undefined, {
        shallow: true,
      })
      .catch((e) => console.log(e));

  React.useEffect(() => {
    if (!chatRoomId) return;

    InitializeChatSocket(
      router.query.id as string,
      setMessages,
      setSocket
    ).catch((err) => console.log(err));

    return () => {
      socket && socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        roomId: String(chatRoomId),
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
