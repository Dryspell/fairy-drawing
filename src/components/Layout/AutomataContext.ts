import { createContext } from "react";

export const AMetaStateContext = createContext<{
  frameTime: {
    displayTime: number;
    frameCount: number;
    delta: number;
    paused: boolean;
    togglePause: () => void;
  };
  aDisplayOptions: string[];
  setADisplayOptions: React.Dispatch<React.SetStateAction<string[]>>;
  aTextOptions: string[];
  setATextOptions: React.Dispatch<React.SetStateAction<string[]>>;
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
  aDisplayOptions: [],
  setADisplayOptions: () => {
    return null;
  },
  aTextOptions: [],
  setATextOptions: () => {
    return null;
  },
});
