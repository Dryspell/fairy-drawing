import React, { useEffect } from "react";
import { BoidKonva } from "./Boid";
import Konva from "konva";
import { useFrameTime } from "../../../lib/hooks/useFrameTime";
import { initialBoidState, updateBoidState } from "../../../lib/boidState";
import type { Boid } from "../../../lib/boidTypes";

export const IndividualBoid = () => {
  console.log("Boid Rendered");
  const [boidState, setBoidState] = React.useState<Boid>(
    initialBoidState(1, { x0: 0, x1: 500, y0: 0, y1: 500 })
  );

  const { delta, displayTime, frameCount } = useFrameTime();

  console.log("displayTime", displayTime);

  useEffect(() => {
    // setFrame(frameTime);
    const newState = {
      ...boidState,
      handleClick: () => {
        console.log("click");
        setBoidState({ ...boidState, color: Konva.Util.getRandomColor() });
      },
    };
    setBoidState(
      updateBoidState(newState, delta, { x0: 0, x1: 500, y0: 0, y1: 500 })
    );
  }, [frameCount, boidState]);

  // console.log({ boidState });

  return (
    <>
      <BoidKonva key={boidState.name} boidState={boidState} />
    </>
  );
};
