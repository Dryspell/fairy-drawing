import dynamic from "next/dynamic";
import React, { useContext, useState } from "react";
import { useAutomataState } from "../../../lib/hooks/useAutomataState";
import { AMetaStateContext } from "../Layout/AutomataContext";
import { type StageBoundaries } from "../../../lib/automataTypes";
import { type AutomataStageProps } from "./AutomataStage";

export const BOARD_PADDING = 50;

export const COLUMN_COUNT = (
  boundaries: StageBoundaries,
  padding: number,
  radius: number
) =>
  Math.floor(
    (boundaries.x1 - boundaries.x0 - 2 * BOARD_PADDING) / (2 * radius + 5)
  ) - 1;

export const ROW_COUNT = (
  boundaries: StageBoundaries,
  padding: number,
  radius: number
) =>
  Math.floor(
    (boundaries.y1 - boundaries.y0 - 2 * BOARD_PADDING) / (2 * radius + 5)
  ) - 1;

const AutomataNoSSR = dynamic<AutomataStageProps>(import("./AutomataStage"), {
  loading: () => (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-center text-2xl font-semibold text-blue-500">
          Loading Automata ....
        </h1>
      </div>
    </>
  ),
  ssr: false,
});

const INITIAL_STAGE_DIM = 1000;

export default function Board() {
  // console.log("GameRoom Rendered");

  const { frameTime, aDisplayOptions, aTextOptions } =
    useContext(AMetaStateContext);

  const initialStageBoundaries = {
    x0: 0,
    x1: INITIAL_STAGE_DIM,
    y0: 0,
    y1: INITIAL_STAGE_DIM / 2,
  };
  if (typeof window !== "undefined") {
    initialStageBoundaries.x1 = window.innerWidth;
    initialStageBoundaries.y1 = window.innerHeight - 200;
  }

  const [stageBoundaries, setStageBoundaries] = React.useState(
    initialStageBoundaries as StageBoundaries
  );

  const gameState = useAutomataState(
    {
      count: 100,
      behavior: "GameOfLife",
    },
    frameTime,
    stageBoundaries
  );

  const [loading] = useState(false);
  const [valid] = useState(true);

  // function handleLoading(value: boolean) {
  //   setLoading(value);
  // }

  // function handleValid(value: boolean) {
  //   setValid(value);
  // }

  return (
    <div className="items-center justify-center align-middle">
      {loading && (
        <>
          <div className="flex h-full w-full items-center justify-center align-middle">
            <h1 className="text-center text-2xl font-semibold text-blue-500">
              Loading Game Room ....
            </h1>
          </div>
        </>
      )}

      {!loading && !valid && (
        <>
          <div className="flex h-full w-full items-center justify-center">
            <h1 className="text-center text-2xl font-semibold text-blue-500">
              Oops, room is full
            </h1>
            <p className="text-center text-xl text-blue-500">
              Please wait for a while and refresh
            </p>
          </div>
        </>
      )}

      {!loading && valid && (
        <>
          <AutomataNoSSR
            stageBoundaries={stageBoundaries}
            setStageBoundaries={setStageBoundaries}
            gameState={gameState}
            helperOptions={{
              showShortestDistanceLines: aDisplayOptions.includes(
                "showShortestDistanceLines"
              ),
              showTarget: aDisplayOptions.includes("showTarget"),
            }}
            textOptions={{
              show: aTextOptions.includes("showText"),
              showAngles: aTextOptions.includes("showAngles"),
              showNames: aTextOptions.includes("showNames"),
              showScores: aTextOptions.includes("showScores"),
            }}
          />
        </>
      )}
    </div>
  );
}
