import type { MessageData } from "../Chat/Message";
import { createContext } from "react";

export const ChatContext = createContext({
  chat: { messages: [] as MessageData[] },
});
