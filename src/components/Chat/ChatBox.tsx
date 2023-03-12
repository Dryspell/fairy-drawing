import { useEffect, useRef, useState } from "react";
import { ScrollArea, Button, Stack, Group } from "@mantine/core";
import { faker } from "@faker-js/faker";
import Message, { MessageData, mockData } from "./Message";

export default function ChatBox(initialMessages: MessageData[]) {
  const viewport = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageData[]>([]);

  const scrollToBottom = () =>
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(() => {
    !initialMessages.length &&
      setMessages(
        Array.from({ length: 10 }).map((a) => {
          return {
            author: { ...mockData.author, username: faker.internet.userName() },
            postedAt: mockData.postedAt,
            body: faker.lorem.paragraph(),
          };
        })
      );
  }, []);

  return (
    <Stack align="center" sx={{ height: 500 }}>
      <ScrollArea viewportRef={viewport}>
        {messages.map((message, index) => (
          <Message
            key={index}
            postedAt={message.postedAt}
            body={message.body}
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
