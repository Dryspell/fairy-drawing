import {
  BOARD_PADDING,
  COLUMN_COUNT,
  ROW_COUNT,
} from "../../src/components/Automata/Board";
import { type StageBoundaries, type Automata } from "../automataTypes";
import {
  type AStateProps,
  behaviorTable,
  type TransitionTable,
} from "../hooks/useAutomataState";

export const initialAutomataState = (
  id: string | number,
  behavior: string,
  boundaries: StageBoundaries
): Automata<{ id: string }> => {
  const radius = 20;

  const a = {
    id,
    name: `Automata ${id}`,
    x: !Number.isNaN(parseInt(String(id)))
      ? Math.random() * COLUMN_COUNT(boundaries, BOARD_PADDING, radius)
      : Math.random() * 800,
    y: !Number.isNaN(parseInt(String(id)))
      ? Math.random() * ROW_COUNT(boundaries, BOARD_PADDING, radius)
      : Math.random() * 600,
    shape: "square",
    radius,
    rotation: 0,
    direction: 0,
    speed: 0,
    acceleration: 0,
    wedgeAngle: 0,
    color: "black",
    target: {
      x: 0,
      y: 0,
    },
    torusClone: {
      x: 0,
      y: 0,
    },
    torusTarget: {
      x: 0,
      y: 0,
    },
    angleToTarget: 0,
    score: 0,
    behavior: behavior || "seekTarget",
    handleClick: () => {
      console.log("click");
    },
  };

  // console.log(`Created automata`, a);
  return a as Automata<{ id: string }>;
};

export const initialGameState = (
  boundaries: StageBoundaries,
  behavior: string,
  count?: number
  // gameState?: Array<Partial<Automata<{ id: string }>>>
) => {
  const initialGameState = [
    // ...(gameState && gameState.length
    //   ? gameState.map((aState, index) => {
    //       return {
    //         ...initialAutomataState(aState.id || index, behavior),
    //         ...aState,
    //       };
    //     })
    //   : []),
    ...[...Array(count ? count : 0).keys()].map((x, index) => {
      // console.log("hello");
      return initialAutomataState(index, behavior, boundaries);
    }),
  ];

  console.log(`Created Initial GameState`, initialGameState);

  return initialGameState;
};

export const updateGameState = (
  gameState: Array<Automata<{ id: string }>>,
  boundaries: StageBoundaries,
  aStateProps: AStateProps
) => {
  if (!gameState.length)
    return initialGameState(boundaries, "GameOfLife", aStateProps.count);

  const transitionTable: TransitionTable =
    behaviorTable[
      aStateProps?.behavior || Object.keys(behaviorTable)[0] || ""
    ] || {};

  const updatedGameState = gameState
    .map((automata) => {
      const state = automata?.state?.id || "";
      const newState = transitionTable[state];

      if (!newState) return null;

      return {
        ...automata,
        state: { id: newState },
      } as Automata<{ id: string }>;
    })
    .filter((a) => a) as Array<Automata<{ id: string }>>;

  console.log(`Updated GameState`, updatedGameState);

  return updatedGameState;
};
