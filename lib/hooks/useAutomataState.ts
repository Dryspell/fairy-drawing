import React, { useEffect } from "react";
import type { useFrameTime } from "./useFrameTime";
import type { Automata, StageBoundaries } from "../automataTypes";
import { updateGameState } from "../automata/gameState";

export type AStateProps = {
  count: number;
  behavior: string;
  helperOptions?: {
    targetLines: boolean;
    shortestDistanceLines: boolean;
    targetVisible: boolean;
  };
  textOptions?: {
    showText: boolean;
  };
};

export type TransitionTable = Record<string, string>;

export const behaviorTable: Record<string, TransitionTable> = {
  GameOfLife: { "62": "1", "53": "1" },
};

export const useAutomataState = (
  aStateProps: AStateProps,
  frameTime: ReturnType<typeof useFrameTime>,
  boundaries: StageBoundaries
) => {
  const { frameCount } = frameTime;

  const [gameState, setGameState] = React.useState(
    [] as Automata<{ id: string }>[]
  );

  useEffect(() => {
    if (frameCount % 100 === 0) console.log(gameState);
    setGameState(updateGameState(gameState, boundaries, aStateProps));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  return gameState;
};
