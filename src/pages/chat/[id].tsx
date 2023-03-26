import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../lib/Chat/types";
import { Box, Container, TextField } from "@mui/material";
import ChatMessage from "../../components/Chat/Message";
import type { MessageData } from "../../components/Chat/Message";
import { faker } from "@faker-js/faker";
import { socketInitializer } from "../../../lib/Chat/socketFunctions";

const Home = () => {
  const router = useRouter();

  const [chatMessage, setChatMessage] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);

  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    if (!router.query.id) return;
    console.log(router.query);

    socketInitializer(router.query.id as string, setMessages, setSocket).catch(
      (err) => console.log(err)
    );

    return () => {
      socket && socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  function socketSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!socket) {
      console.log("socket not initialized");
      return;
    }

    const message: MessageData = {
      messageId: faker.datatype.uuid(),
      roomId: String(router.query.id),
      text: chatMessage,
      author: {
        username: username || "Anonymous",
        name: username || "Anonymous",
        image: faker.internet.avatar() || "",
      },
      postedAt: new Date().toLocaleDateString(),
      replies: [],
    };

    console.log("emitted");

    socket.emit("send-message", message);

    setChatMessage("");
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
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            messages={messages}
            setMessages={setMessages}
          />
        ))}
        <form onSubmit={socketSubmit}>
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
