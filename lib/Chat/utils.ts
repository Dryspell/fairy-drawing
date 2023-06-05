import { type Message, type User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import cuid from "cuid";

export const createMessageFromPlainText = (input: {
  text?: string;
  roomId?: string;
  user?: Partial<User>;
}): Message & { user?: Partial<User>; replies?: Message[] } => {
  const defaultMessage = (userId?: string) => {
    return {
      messageId: cuid(),
      roomId: cuid(),
      userId: cuid(),
      user: {
        id: userId,
        email: faker.internet.email(),
        emailVerified: new Date(Date.now()),
        image: faker.internet.avatar(),
        name: faker.internet.userName(),
        username: faker.internet.email(),
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        ...input.user,
      },
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      text: input.text || faker.lorem.paragraph(),
      replies: [],
      replyToId: null,
    };
  };

  return { ...defaultMessage(input.user?.id) };
};
