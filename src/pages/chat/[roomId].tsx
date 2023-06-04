import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Box, Container, TextField } from "@mui/material";
import ChatMessage from "../../components/Chat/Message";
import { type Room, type Message, User } from "@prisma/client";
import { createMessageFromPlainText } from "../../../lib/Chat/utils";
import { api } from "../../utils/api";
import { pusherClient } from "../../../lib/pusher";
import { useSession } from "next-auth/react";
// import {
//   InitializeChatSocket,
//   socketSubmitMessage,
// } from "../../../lib/Chat/socketFunctions";
// import type { Socket } from "socket.io-client";
// import type {
//   ClientToServerEvents,
//   ServerToClientEvents,
// } from "../../../lib/Chat/types";

const Home = () => {
  const { data: session } = useSession({
    required: false,
  });
  const router = useRouter();

  const [chatMessage, setChatMessage] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);

  const [room, setRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User | null>(
    (session?.user as User) || null
  );

  useEffect(() => {
    console.log("useEffect Setup Pusher Chat Socket");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    pusherClient.subscribe(String(router.query.roomId));
    pusherClient.bind("messages:new", handleReceiveMessage);
    return () => {
      pusherClient.unsubscribe(String(router.query.roomId));
      pusherClient.unbind("messages:new");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.roomId]);

  const getOrCreateRoom = api.chat.getOrCreateRoom.useQuery(
    { roomId: String(router.query.roomId) },
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

  const { mutate: createOrUpdate } = api.chat.createOrUpdateMessage.useMutation(
    {
      onMutate: ({ message }) => {
        // Optimistic Update
        !messages.find((m) => m.messageId === message.messageId) &&
          setMessages([...messages, message]);
      },

      onSuccess: ({ updatedMessage, updatedConversation }) => {
        if (!updatedConversation) return;

        setUser(updatedMessage.user);

        console.log(
          `Created Message: ${
            updatedConversation.messages.at(-1)?.text || "Unknown Message"
          } in Room ${updatedConversation.id}`
        );
        updatedConversation.messages &&
          setMessages(updatedConversation.messages);
      },
    }
  );

  const { mutate: seen } = api.chat.seen.useMutation();

  const handleReceiveMessage = (message: Message) => {
    if (!messages.find((m) => m.messageId === message.messageId)) {
      console.log(`Received new message: ${message.text}`);
      setMessages([...messages, message]);
      seen({ messageId: message.messageId, username });
    }
  };

  return (
    <Container className="p-10">
      <TextField
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Box>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            messages={messages}
            setMessages={setMessages}
          />
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const message = createMessageFromPlainText({
              text: chatMessage,
              roomId: String(router.query.roomId),
              username,
              name: user?.username || "Unknown User",
              user: user || undefined,
            });

            console.log(`Sending message`, message);

            createOrUpdate({ message });
            // socketSubmitMessage(socket, message);
            setChatMessage("");
          }}
        >
          <TextField
            name="message"
            placeholder="Enter your message"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            autoComplete={"off"}
          />
        </form>
      </Box>
    </Container>
  );
};

export default Home;
