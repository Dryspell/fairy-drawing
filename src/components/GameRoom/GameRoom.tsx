import dynamic from "next/dynamic";
import React, { useContext, useState } from "react";
import { useBoidFlock } from "../../../lib/hooks/useBoidFlock";
import type { BoidsStageProps } from "../Boids/BoidsStage";
import { BoidsMetaStateContext } from "../Layout/GameRoomContext";

const BoidsNoSSR = dynamic<BoidsStageProps>(import("../Boids/BoidsStage"), {
  loading: () => (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-center text-2xl font-semibold text-blue-500">
          Loading Boids ....
        </h1>
      </div>
    </>
  ),
  ssr: false,
});

const INITIAL_STAGE_DIM = 1000;

export default function GameRoom() {
  // console.log("GameRoom Rendered");

  const { frameTime, boidsDisplayOptions, boidsTextOptions } = useContext(
    BoidsMetaStateContext
  );

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
    initialStageBoundaries
  );

  const flockState = useBoidFlock(
    {
      count: 10,
      behavior: "seekTarget",
    },
    frameTime,
    stageBoundaries
  );

  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);

  function handleLoading(value: boolean) {
    setLoading(value);
  }

  function handleValid(value: boolean) {
    setValid(value);
  }

  return (
    <div>
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
          <BoidsNoSSR
            stageBoundaries={stageBoundaries}
            setStageBoundaries={setStageBoundaries}
            flockState={flockState}
            helperOptions={{
              showShortestDistanceLines: boidsDisplayOptions.includes(
                "showShortestDistanceLines"
              ),
              showTarget: boidsDisplayOptions.includes("showTarget"),
            }}
            textOptions={{
              show: boidsTextOptions.includes("showText"),
              showAngles: boidsTextOptions.includes("showAngles"),
              showNames: boidsTextOptions.includes("showNames"),
              showScores: boidsTextOptions.includes("showScores"),
            }}
          />
        </>
      )}
    </div>
  );
}
