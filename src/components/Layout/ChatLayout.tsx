// import type { Socket } from "socket.io-client";
// import type {
//   ClientToServerEvents,
//   ServerToClientEvents,
// } from "../../../lib/Chat/types";
// import { InitializeChatSocket } from "../../../lib/Chat/socketFunctions";
import React from "react";
import { useRouter } from "next/router";
import { faker } from "@faker-js/faker";
import { type Room, User, type Message } from "@prisma/client";
import { api } from "../../utils/api";
import { getSession, useSession } from "next-auth/react";

export const ChatContext = React.createContext({
  // socket: null as Socket<ServerToClientEvents, ClientToServerEvents> | null,
  session: null as Awaited<ReturnType<typeof getSession>> | null,
  // user: null as Partial<User> | null,
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
  // const [socket, setSocket] = React.useState<Socket<
  //   ServerToClientEvents,
  //   ClientToServerEvents
  // > | null>(null);
  const { data: session } = useSession({
    required: false,
  });
  // const [user, setUser] = React.useState<Partial<User> | null>(
  //   (session?.user as User) || null
  // );

  const [messages, setMessages] = React.useState<Message[]>([]);

  const [roomId, setRoomId] = React.useState(
    (router.query.roomId && String(router.query.roomId)) || faker.word.noun()
  );

  if (!router.query.roomId && roomId !== router.query.roomId) {
    console.log({ roomId: router.query.roomId });
    router
      .replace(
        {
          pathname: router.pathname,
          query: { ...router.query, roomId },
        },
        undefined,
        {
          shallow: true,
        }
      )
      .catch((e) => console.log(e));
  }

  const [room, setRoom] = React.useState<Room | null>(null);
  const { isLoading: roomLoading } = api.chat.getOrCreateRoom.useQuery(
    { roomId: roomId },
    {
      enabled: Boolean(router.query.roomId),
      onSuccess: (newRoom) => {
        // if (room) router.query = { ...router.query, roomId: room.id };
        newRoom && newRoom.id !== room?.id && setRoom(newRoom);
        newRoom?.messages && setMessages(newRoom.messages);
        // router.push(router.query, undefined, { shallow: true }).catch((err) => {
        //   console.log(err);
        // });
      },
    }
  );

  // .push(`?chatId=${String(chatRoomId)}`, undefined, {
  //   shallow: true,
  // })
  // .catch((e) => console.log(e));

  // React.useEffect(() => {
  //   if (!chatRoomId) return;

  //   InitializeChatSocket(
  //     router.query.id as string,
  //     setMessages,
  //     setSocket
  //   ).catch((err) => console.log(err));

  //   return () => {
  //     socket && socket.disconnect();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chatRoomId]);

  return (
    <ChatContext.Provider
      value={{
        // socket,
        session,
        // user,
        roomId: String(roomId),
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
