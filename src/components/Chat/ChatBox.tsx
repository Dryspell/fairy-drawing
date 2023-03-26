import { useContext, useEffect, useRef, useState } from "react";
import { ScrollArea, Stack } from "@mantine/core";
import { faker } from "@faker-js/faker";
import ChatMessage from "./Message";
import { Box, IconButton, TextField } from "@mui/material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { useSession } from "next-auth/react";
import type { MessageData } from "../../../lib/Chat/types";
import { ChatContext } from "../Layout/ChatLayout";
import {
  createMessageFromPlainText,
  socketSubmitMessage,
} from "../../../lib/Chat/socketFunctions";
import type { User } from "@prisma/client";

export default function ChatBox(props: { initialMessages?: MessageData[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { socket, roomId, messages, setMessages } = useContext(ChatContext);

  const [chatText, setChatText] = useState("");

  const handleChatSubmit = () => {
    const message = createMessageFromPlainText({
      text: chatText,
      roomId,
      user: session?.user as User,
    });
    setMessages((pre) => [...pre, message]);
    socketSubmitMessage(socket, message);
    setChatText("");
    scrollToBottom();
  };

  const scrollToBottom = () =>
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(() => {
    scrollToBottom();

    !props?.initialMessages?.length &&
      setMessages(
        Array.from({ length: 10 }).map(() => {
          return {
            messageId: faker.datatype.uuid(),
            roomId,
            author: {
              image: faker.internet.avatar(),
              name: faker.internet.userName(),
              username: faker.internet.email(),
            },
            postedAt: `${Math.floor(Math.random() * 60)} minutes ago`,
            text: faker.lorem.paragraph(),
            replies: [],
          };
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.initialMessages?.length, roomId]);

  return (
    <div className="mt-0">
      <Stack sx={{ height: "80vh" }}>
        <ScrollArea viewportRef={viewport}>
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              messages={messages}
              setMessages={setMessages}
            />
          ))}
          <Box sx={{ position: "absolute", bottom: 2, right: 8 }}>
            <IconButton className="bg-gray-100" onClick={scrollToBottom}>
              <KeyboardDoubleArrowDownIcon />
            </IconButton>
          </Box>
        </ScrollArea>
        <Box sx={{ width: "100%" }}>
          <form className="flex-grow" onSubmit={handleChatSubmit}>
            <TextField
              id="reply-input"
              label={`Chat...`}
              fullWidth
              multiline
              maxRows={4}
              placeholder={`Chat...`}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit();
                }
              }}
            />
          </form>
        </Box>
      </Stack>
    </div>
  );
}
