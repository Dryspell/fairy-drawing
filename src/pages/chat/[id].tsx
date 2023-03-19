import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  MessageData,
  ServerToClientEvents,
} from "../../../lib/Chat/types";
import { Box, Container, TextField } from "@mui/material";
import ChatMessage from "../../components/Chat/Message";

const origin = () =>
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

async function socketInitializer(
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

      console.log(`received: ${data.message}`);
    }
  );
  setSocket(socket);
}

const Home = () => {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [allMessages, setAllMessages] = useState<MessageData[]>([]);

  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    if (!router.query.id) return;
    console.log(router.query);

    socketInitializer(
      router.query.id as string,
      setAllMessages,
      setSocket
    ).catch((err) => console.log(err));

    return () => {
      socket && socket.disconnect();
    };
  }, [router.query.id]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!socket) {
      console.log("socket not initialized");
      return;
    }

    console.log("emitted");

    socket.emit("send-message", {
      username,
      message,
    });

    setMessage("");
  }

  return (
    <Container className="p-10">
      <TextField
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Box>
        {allMessages.map(({ username, message }, index) => (
          <ChatMessage
            key={index}
            postedAt={""}
            author={{ username, name: username, image: "" }}
            text={message}
            replies={[]}
          />
        ))}
        <form onSubmit={handleSubmit}>
          <TextField
            name="message"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete={"off"}
          />
        </form>
      </Box>
    </Container>
  );
};

export default Home;
