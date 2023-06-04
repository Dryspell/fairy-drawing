import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const accountRouter = createTRPCRouter({
  upsertUser: publicProcedure
    .input(z.object({ username: z.string(), roomId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.upsert({
        where: {
          username: input.username,
        },
        create: {
          username: input.username,
          email: input.username,
          rooms: {
            connectOrCreate: {
              where: {
                roomId: input.roomId,
              },
              create: {
                roomId: input.roomId,
                name: input.roomId,
              },
            },
          },
        },
        update: {},
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
});
