import { createContext } from "react";
import { MessageData } from "../Chat/Message";

export const ChatContext = createContext({
  chat: { messages: [] as MessageData[] },
});
export const MarketContext = createContext({ market: {} });

export const defaultBoidsDisplayOptions = [
  "showShortestDistanceLines",
  "showTarget",
];
export const defaultBoidsTextOptions = ["showText", "showNames", "showScores"];

export const BoidsMetaStateContext = createContext<{
  frameTime: {
    displayTime: number;
    frameCount: number;
    delta: number;
    paused: boolean;
    togglePause: () => void;
  };
  boidsDisplayOptions: string[];
  setBoidsDisplayOptions: React.Dispatch<React.SetStateAction<string[]>>;
  boidsTextOptions: string[];
  setBoidsTextOptions: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  frameTime: {
    displayTime: 0,
    frameCount: 0,
    delta: 0,
    paused: false,
    togglePause: () => {
      return null;
    },
  },
  boidsDisplayOptions: defaultBoidsDisplayOptions,
  setBoidsDisplayOptions: () => {
    return null;
  },
  boidsTextOptions: defaultBoidsTextOptions,
  setBoidsTextOptions: () => {
    return null;
  },
});
