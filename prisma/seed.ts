import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function seed() {
  // Create 10 users
  for (let i = 0; i < 10; i++) {
    const messages = Array.from(
      { length: Math.floor(Math.random() * 10) },
      () => ({
        text: faker.lorem.sentence(),
        roomId: faker.datatype.uuid(),
      })
    );

    const user = await prisma.user.create({
      data: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        messages: {
          create: messages,
        },
      },
    });
    console.log(
      `Created user with id: ${user.id} and ${messages.length} messages`
    );
  }
}
