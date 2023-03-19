import { useEffect, useRef, useState } from "react";
import { ScrollArea, Button, Stack, Group } from "@mantine/core";
import { faker } from "@faker-js/faker";
import ChatMessage, { mockData } from "./Message";
import type { MessageData } from "./Message";

export default function ChatBox(props: { initialMessages?: MessageData[] }) {
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
          };
        })
      );
  }, []);

  return (
    <Stack align="center" sx={{ height: 500 }}>
      <ScrollArea viewportRef={viewport}>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            postedAt={message.postedAt}
            text={message.text}
            author={message.author}
          />
        ))}
      </ScrollArea>

      <Group position="center">
        <Button onClick={scrollToBottom} variant="outline">
          Scroll to bottom
        </Button>
      </Group>
    </Stack>
  );
}
