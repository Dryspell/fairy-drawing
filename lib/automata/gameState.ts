import {
  BOARD_PADDING,
  COLUMN_COUNT,
  ROW_COUNT,
} from "../../src/components/Automata/Board";
import { type StageBoundaries, type Automata } from "../automataTypes";
import { getRandomColor } from "../boids/boidsUtils";
import { type useAutomataState } from "../hooks/useAutomataState";
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
      ? Math.floor(
          Math.random() * COLUMN_COUNT(boundaries, BOARD_PADDING, radius)
        )
      : Math.random() * 800,
    y: !Number.isNaN(parseInt(String(id)))
      ? Math.floor(Math.random() * ROW_COUNT(boundaries, BOARD_PADDING, radius))
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
    handleClick: () => void 0,
  };
  a.handleClick = () => {
    console.log(`Clicked ${a.name} (${a.x}, ${a.y})`);
    a.color = getRandomColor();
  };

  // console.log(`Created automata`, a);
  return a as Automata<{ id: string }>;
};

export const initialGameState = (
  boundaries: StageBoundaries,
  behavior: string,
  count?: number
) => {
  const initialGameState = [
    ...[...Array(count ? count : 0).keys()].map((x, index) => {
      return initialAutomataState(index, behavior, boundaries);
    }),
  ];

  console.log(`Created Initial GameState`, initialGameState);

  return initialGameState;
};

export const updateGameState = (
  gameState: ReturnType<typeof useAutomataState>,
  boundaries: StageBoundaries,
  aStateProps: AStateProps
) => {
  if (!gameState.current) throw new Error(`Null gameState Supplied`);

  const getNeighbors = (a: Automata<{ id: string }>) =>
    gameState.current?.filter((automata) => {
      return (
        a.id !== automata.id &&
        Math.abs(a.x - automata.x) < 1.5 &&
        Math.abs(a.y - automata.y) < 1.5
      );
    }) || [];

  // console.log(`GameState1`, gameState.current);

  const transitionTable: TransitionTable =
    behaviorTable[
      aStateProps?.behavior || Object.keys(behaviorTable)[0] || ""
    ] || {};

  const newState: Record<string, Automata<{ id: string }>> = Object.fromEntries(
    gameState.current.map((a) => [`${a.x}_${a.y}`, a])
  );

  for (const a of gameState.current) {
    const neighbors = getNeighbors(a);

    for (const n of [...neighbors, a]) {
      if (newState[`${n.x}_${n.y}`]) continue;
      const neighborsOfNeighbor = getNeighbors(n);
      const transitionValue = `${8 - neighborsOfNeighbor.length}${
        neighborsOfNeighbor.length
      }`;
      console.log(`Automata (${n.x}, ${n.y}): transition: ${transitionValue}`);
      const transition = transitionTable[transitionValue];
      if (transition)
        newState[`${n.x}_${n.y}`] = {
          ...initialAutomataState(`${n.x}_${n.y}`, "GameOfLife", boundaries),
        };
    }
  }

  return Object.values(newState).filter((x) => Boolean(x)) as Automata<{
    id: string;
  }>[];
};
