import { useEffect, useRef, useState } from "react";
import { ScrollArea, Stack, Group } from "@mantine/core";
import { faker } from "@faker-js/faker";
import ChatMessage, { mockData } from "./Message";
import type { MessageData } from "./Message";
import { Box, IconButton, TextField } from "@mui/material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

export default function ChatBox(props: {
  initialMessages?: MessageData[];
  roomId: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageData[]>([]);

  const scrollToBottom = () =>
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(() => {
    !props?.initialMessages?.length &&
      setMessages(
        Array.from({ length: 10 }).map((a) => {
          return {
            author: { ...mockData.author, username: faker.internet.userName() },
            postedAt: mockData.postedAt,
            text: faker.lorem.paragraph(),
            replies: [],
          };
        })
      );
  }, []);

  return (
    <div className="mt-0">
      <Stack sx={{ height: "80vh" }}>
        <ScrollArea viewportRef={viewport}>
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              postedAt={message.postedAt}
              text={message.text}
              author={message.author}
              replies={message.replies}
            />
          ))}
          <Box sx={{ position: "absolute", bottom: 2, right: 8 }}>
            <IconButton className="bg-gray-100" onClick={scrollToBottom}>
              <KeyboardDoubleArrowDownIcon />
            </IconButton>
          </Box>
        </ScrollArea>
        <Box sx={{ width: "100%" }}>
          <div className="flex-grow">
            <TextField
              id="reply-input"
              label={`Chat...`}
              fullWidth
              multiline
              maxRows={4}
              placeholder={`Chat...`}
            />
          </div>
        </Box>
      </Stack>
    </div>
  );
}
