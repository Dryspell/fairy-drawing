import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { gptRouter } from "./routers/gpt";
import { chatRouter } from "./routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  gpt: gptRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
