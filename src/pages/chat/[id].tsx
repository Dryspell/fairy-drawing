import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  MessageData,
  ServerToClientEvents,
} from "../../../lib/Chat/types";

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
  await fetch(`/api/chat/${chatId}`);

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

  socket.on(
    "receive-message",
    (data: Parameters<ServerToClientEvents["receive-message"]>[0]) => {
      setAllMessages((pre) => [...pre, data]);
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
    socketInitializer(
      router.query.id as string,
      setAllMessages,
      setSocket
    ).catch((err) => console.log(err));

    return () => {
      socket && socket.disconnect();
    };
  }, []);

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
    <div>
      <h1>Chat app</h1>
      <h1>Enter a username</h1>

      <input value={username} onChange={(e) => setUsername(e.target.value)} />

      <br />
      <br />

      <div>
        {allMessages.map(({ username, message }, index) => (
          <div key={index}>
            {username}: {message}
          </div>
        ))}

        <br />

        <form onSubmit={handleSubmit}>
          <input
            name="message"
            placeholder="enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete={"off"}
          />
        </form>
      </div>
    </div>
  );
};

export default Home;
