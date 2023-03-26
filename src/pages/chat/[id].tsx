import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  MessageData,
  ServerToClientEvents,
} from "../../../lib/Chat/types";
import { Box, Container, TextField } from "@mui/material";
import ChatMessage from "../../components/Chat/Message";
import {
  createMessageFromPlainText,
  InitializeChatSocket,
  socketSubmitMessage,
} from "../../../lib/Chat/socketFunctions";

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

    InitializeChatSocket(
      router.query.id as string,
      setMessages,
      setSocket
    ).catch((err) => console.log(err));

    return () => {
      socket && socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

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
            socketSubmitMessage(
              socket,
              createMessageFromPlainText({
                text: chatMessage,
                roomId: router.query.id as string,
                username,
              })
            );
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
