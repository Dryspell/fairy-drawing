import { useEffect, useRef, useState } from "react";
import { ScrollArea, Button, Stack, Group } from "@mantine/core";
import { faker } from "@faker-js/faker";
import Message, { mockData } from "./Message";

export default function ChatBox() {
  const viewport = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<string[]>([]);

  const scrollToBottom = () =>
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(
    () =>
      setMessages(
        Array.from({ length: 10 }).map((a) => faker.lorem.paragraph())
      ),
    []
  );

  return (
    <Stack align="center" sx={{ height: 500 }}>
      <ScrollArea viewportRef={viewport}>
        {messages.map((message, index) => (
          <Message
            key={index}
            postedAt={mockData.postedAt}
            body={mockData.body}
            author={mockData.author}
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
