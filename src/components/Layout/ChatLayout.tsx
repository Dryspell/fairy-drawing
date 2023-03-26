import type { Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../lib/Chat/types";
import { socketInitializer } from "../../../lib/Chat/socketFunctions";
import React from "react";
import { useRouter } from "next/router";
import type { MessageData } from "../Chat/Message";
import { ChatContext } from "./ChatContext";

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

  React.useEffect(() => {
    if (!router.query.id) return;

    socketInitializer(router.query.id as string, setMessages, setSocket).catch(
      (err) => console.log(err)
    );

    return () => {
      socket && socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  return (
    <ChatContext.Provider value={{ chat: { messages } }}>
      {children}
    </ChatContext.Provider>
  );
}
