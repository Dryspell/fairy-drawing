import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { gptRouter } from "./routers/gpt";
import { chatRouter } from "./routers/chat";
import { accountRouter } from "./routers/account";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  gpt: gptRouter,
  chat: chatRouter,
  account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
