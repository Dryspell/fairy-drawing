import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { pusherServer } from "../../../../lib/pusher";
import { MessageSchema } from "../../../../prisma/generated/zod";

export const chatRouter = createTRPCRouter({
  getOrCreateRoom: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ input, ctx }) => {
      const room = await ctx.prisma.room.upsert({
        where: {
          roomId: input.roomId,
        },
        create: {
          roomId: input.roomId,
          name: input.roomId,
          ...(ctx.session?.user?.id && {
            users: {
              connect: {
                id: ctx.session?.user?.id,
              },
            },
          }),
        },
        update: {
          ...(ctx.session?.user?.id && {
            users: {
              connect: {
                id: ctx.session?.user?.id,
              },
            },
          }),
        },
        include: {
          users: true,
          messages: {
            include: {
              user: true,
            },
          },
        },
      });
      console.log(room);

      return room;
    }),

  seen: publicProcedure
    .input(z.object({ messageId: z.string(), username: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const updatedMessage = await ctx.prisma.message.update({
        where: {
          messageId: input.messageId,
        },
        data: {
          seenBy: {
            connect: {
              username: input.username,
            },
          },
        },
      });

      console.log(
        `${ctx.session?.user?.id || "Unknown User"} has seen Message ${
          updatedMessage.messageId
        }: ${updatedMessage.text}`
      );

      return updatedMessage;
    }),

  createOrUpdateMessage: publicProcedure
    .input(
      z.object({
        // message: z.object({
        //   messageId: z.string().optional(),
        //   text: z.string(),
        //   roomId: z.string(),
        //   userId: z.string(),
        // }),
        message: MessageSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { messageId, ...message } = input.message;

      console.log(messageId, message);

      const [updatedMessage, updatedConversation] =
        await ctx.prisma.$transaction([
          ctx.prisma.message.upsert({
            where: {
              messageId,
            },
            create: {
              text: message.text,
              room: {
                connectOrCreate: {
                  where: {
                    roomId: message.roomId,
                  },
                  create: {
                    roomId: message.roomId,
                    name: message.roomId,
                  },
                },
              },
              user: {
                connectOrCreate: {
                  where: {
                    id: message.userId,
                  },
                  create: {
                    id: message.userId,
                    name: message.userId.slice(-5),
                  },
                },
              },
            },
            update: {
              text: message.text,
            },
            include: {
              user: true,
            },
          }),
          ctx.prisma.room.upsert({
            where: {
              roomId: input.message.roomId,
            },
            update: {
              lastMessageAt: new Date(),
            },
            create: {
              roomId: input.message.roomId,
              name: input.message.text.replace(/<[^>]*>?/gm, ""),
              lastMessageAt: new Date(),
              users: {
                connectOrCreate: {
                  where: {
                    id: input.message.userId,
                  },
                  create: {
                    name: input.message.userId.slice(-5),
                  },
                },
              },
            },
            include: {
              users: true,
              messages: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 5,
                include: {
                  user: true,
                },
              },
            },
          }),
        ]);

      await pusherServer.trigger(input.message.roomId, "messages:new", {
        message: input.message,
      });

      updatedConversation.users.map((user) =>
        pusherServer.trigger(user.id, "conversation:update", {
          id: updatedConversation.id,
          message: [updatedConversation.messages[0]],
        })
      );

      return {
        updatedMessage,
        updatedConversation,
      };
    }),
});
