import type { Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  MessageData,
  ServerToClientEvents,
} from "../../../lib/Chat/types";
import { socketInitializer } from "../../../lib/Chat/socketFunctions";
import React from "react";
import { useRouter } from "next/router";

export const ChatContext = React.createContext({
  socket: null as Socket<ServerToClientEvents, ClientToServerEvents> | null,
  roomId: "",
  messages: [] as MessageData[],
  setMessages: (() => void 0) as React.Dispatch<
    React.SetStateAction<MessageData[]>
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
  const [messages, setMessages] = React.useState<MessageData[]>([]);

  const chatRoomId = router.query.chatId;

  React.useEffect(() => {
    if (!chatRoomId) return;

    socketInitializer(router.query.id as string, setMessages, setSocket).catch(
      (err) => console.log(err)
    );

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
