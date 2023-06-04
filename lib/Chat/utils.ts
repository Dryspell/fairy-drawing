import { type Message, type User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import cuid from "cuid";

export const createMessageFromPlainText = (
  input:
    | "test"
    | {
        text: string;
        roomId: string;
        username?: string;
        name?: string;
        user?: Partial<User>;
      }
): Message & { user?: Partial<User>; replies: Message[] } => {
  const defaultMessage = (userId = faker.datatype.uuid()) => {
    return {
      messageId: cuid(),
      roomId: faker.datatype.uuid(),
      userId,
      user: {
        id: userId,
        email: faker.internet.email(),
        emailVerified: new Date(Date.now()),
        image: faker.internet.avatar(),
        name: faker.internet.userName(),
        username: faker.internet.email(),
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      text: faker.lorem.paragraph(),
      replies: [],
      replyToId: null,
    };
  };

  if (input === "test") return defaultMessage();

  // const message = {
  //   messageId: faker.datatype.uuid(),
  //   roomId: String(input.roomId),
  //   text: input.text,
  //   user: {
  //     id: input.user?.id || faker.datatype.uuid(),
  //     username: input.user?.email || input.username || "Anonymous",
  //     name: input.user?.name || input.name || input.username || "Anonymous",
  //     image: faker.internet.avatar() || "",
  //   },
  //   createdAt: new Date().toLocaleDateString(),
  //   replies: [],
  // };
  return { ...defaultMessage(input.user?.id), ...input };
};
