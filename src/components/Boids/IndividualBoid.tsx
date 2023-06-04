import React, { useEffect } from "react";
import { AKonva } from "./AKonva";
import Konva from "konva";
import { useFrameTime } from "../../../lib/hooks/useFrameTime";
import {
  initialBoidState,
  updateBoidState,
} from "../../../lib/boids/boidState";
import type { Automata } from "../../../lib/automataTypes";

export const IndividualBoid = () => {
  console.log("Boid Rendered");
  const [boidState, setBoidState] = React.useState<Automata>(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, boidState]);

  // console.log({ boidState });

  return (
    <>
      <AKonva
        key={boidState.name}
        aState={boidState}
        helperOptions={{
          showShortestDistanceLines: true,
          showTarget: true,
        }}
        textOptions={{
          show: true,
          showAngles: false,
          showNames: true,
          showScores: true,
        }}
      />
    </>
  );
};
