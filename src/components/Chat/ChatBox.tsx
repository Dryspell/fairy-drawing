import { useContext, useEffect, useRef, useState } from "react";
import { ScrollArea, Stack } from "@mantine/core";
import ChatMessage from "./Message";
import { Box, IconButton, TextField } from "@mui/material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { useSession } from "next-auth/react";
import { ChatContext } from "../Layout/ChatLayout";
import { socketSubmitMessage } from "../../../lib/Chat/socketFunctions";
import type { Message, User } from "@prisma/client";
import { createMessageFromPlainText } from "../../../lib/Chat/utils";

// const mode = "test";
export const mode: "test" | "normal" | "admin" = "normal";

export default function ChatBox(props: { initialMessages?: Message[] }) {
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

    mode === "test" &&
      !props?.initialMessages?.length &&
      setMessages(
        Array.from({ length: 10 }).map(() => createMessageFromPlainText("test"))
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
