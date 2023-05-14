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
import { randomInt } from "mathjs";

export const initialAutomataState = (
  iState: Partial<Automata<{ id: string }>>,
  boundaries: StageBoundaries
): Automata<{ id: string }> => {
  const radius = 20;

  const id = iState.id || String(randomInt(0, 1000000));
  const state = { id: "1" };

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
    color: state ? "black" : "white",
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
    behavior: iState.behavior || "random",
    state,
    handleClick: () => void 0,
    ...iState,
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
      return initialAutomataState(
        { id: index, behavior, state: { id: "1" } },
        boundaries
      );
    }),
  ];

  // console.log(`Created Initial GameState`, initialGameState);

  return initialGameState;
};

export const updateGameState = (
  gameState: ReturnType<typeof useAutomataState>,
  boundaries: StageBoundaries,
  aStateProps: AStateProps
) => {
  if (!gameState.current) throw new Error(`Null gameState Supplied`);

  const getNeighbors = (
    a: NonNullable<ReturnType<typeof useAutomataState>["current"]>[0],
    gameState: NonNullable<ReturnType<typeof useAutomataState>["current"]>,
    neighborhoodRadius = 1.5
  ) => {
    const mooreNeighborhood = (a: Automata, radius = neighborhoodRadius) => {
      const neighborhood = [] as { x: number; y: number }[];
      for (let i = 1; i < radius; i++) {
        const neighbors = [
          { x: a.x - i, y: a.y - i },
          { x: a.x - i, y: a.y },
          { x: a.x - i, y: a.y + i },
          { x: a.x, y: a.y - i },
          { x: a.x, y: a.y + i },
          { x: a.x + i, y: a.y - i },
          { x: a.x + i, y: a.y },
          { x: a.x + i, y: a.y + i },
        ];
        neighborhood.push(...neighbors);
      }
      return neighborhood;
    };

    const mooreNbhd = mooreNeighborhood(a);
    // console.log(
    //   `MooreNeighborhood: ${mooreNbhd.length}, sample: ${JSON.stringify(
    //     mooreNbhd[0]
    //   )}`
    // );

    return mooreNbhd.map((n) => {
      const neighbor =
        gameState?.find((automata) => automata.x == n.x && automata.y == n.y) ||
        initialAutomataState(
          {
            id: `${n.x}_${n.y}`,
            behavior: aStateProps?.behavior,
            state: { id: "0" },
            x: n.x,
            y: n.y,
          },
          boundaries
        );

      return neighbor;
    });
  };

  // console.log(`GameState1`, gameState.current);

  const transitionTable: TransitionTable =
    behaviorTable[
      aStateProps?.behavior || Object.keys(behaviorTable)[0] || ""
    ] || {};

  const newState: Record<string, Automata<{ id: string }>> = {};

  for (const a of gameState.current) {
    const neighbors = getNeighbors(a, gameState.current);

    for (const n of [...neighbors, a]) {
      if (newState[`${n.x}_${n.y}`]) {
        console.log(`State for (${n.x}, ${n.y}) already computed`);
        continue;
      }
      const neighborsOfNeighbor = getNeighbors(n, gameState.current);

      const transitionValue = `${
        neighborsOfNeighbor.filter((non) => !non.state || non.state?.id == "0")
          .length
      }${
        neighborsOfNeighbor.filter((non) => non.state && non.state?.id == "1")
          .length
      }`;

      const transition = transitionTable[transitionValue];

      console.log(
        `Automata (${n.x}, ${n.y}); state: ${JSON.stringify(
          a.state
        )}; transitionValue: ${transitionValue}; transition: ${String(
          transition
        )}`
      );

      if (transition)
        newState[`${n.x}_${n.y}`] = {
          ...n,
          state: { id: transition },
        };
    }
  }

  return Object.values(newState).filter((x) => Boolean(x)) as Automata<{
    id: string;
  }>[];
};
