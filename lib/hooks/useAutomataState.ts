import React, { useEffect } from "react";
import type { useFrameTime } from "./useFrameTime";
import type { Automata, StageBoundaries } from "../automataTypes";
import { initialGameState, updateGameState } from "../automata/gameState";

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

export const FRAME_FREQUENCY = 100;

export const useAutomataState = (
  aStateProps: AStateProps,
  frameTime: ReturnType<typeof useFrameTime>,
  boundaries: StageBoundaries
) => {
  const { frameCount } = frameTime;

  const gameState = React.useRef<Automata<{ id: string }>[] | null>(null);
  if (gameState.current === null) {
    gameState.current = initialGameState(
      boundaries,
      aStateProps.behavior,
      aStateProps.count
    );
  }

  // const [gameState, setGameState] = React.useState(
  //   [] as Automata<{ id: string }>[]
  // );

  useEffect(() => {
    if (
      frameCount !== 0 &&
      frameCount % FRAME_FREQUENCY === 0 &&
      gameState.current
    ) {
      gameState.current = updateGameState(gameState, boundaries, aStateProps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  return gameState;
};
