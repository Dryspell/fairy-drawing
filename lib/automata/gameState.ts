import { type Automata } from "../automataTypes";

export const initialAutomataState = (id: string | number): Automata => {
  return {
    name: `Automata ${id}`,
    x: 0,
    y: 0,
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
    behavior: "seekTarget",
    handleClick: () => {
      console.log("click");
    },
  };
};

export const initialGameState = (
  n?: number,
  gameState?: Array<Partial<Automata>>
) => {
  const initialGameState = [
    ...(gameState ? gameState : []),
    ...Array(n ? n - (gameState?.length || 0) : 0).map((x, index) =>
      initialAutomataState(index)
    ),
  ];

  return initialGameState;
};

export const updateGameState = (
  gameState: Array<Automata<{ id: string }>>,
  transitionTable: Record<string, string>
) => {
  const updatedGameState = gameState.map((automata) => {
    const state = automata?.state?.id || "";
    const newState = transitionTable[state];

    return {
      ...automata,
      state: newState,
    };
  });

  return updatedGameState;
};
