import { useFrameTime } from "../../lib/useFrameTime";
import React, { useEffect } from "react";
import { Boid, initialBoidState, updateBoidState } from "./Boid";
import Konva from "konva";

export const IndividualBoid = () => {
  console.log("Boid Rendered");
  const [boidState, setBoidState] = React.useState<Boid>(initialBoidState);

  const frameTime = useFrameTime();

  const [frames, setFrames] = React.useState({
    last: frameTime,
    current: frameTime,
  });

  console.log("frameTime", frameTime, frames);

  useEffect(() => {
    setFrames({ last: frames.current, current: frameTime });
    const delta = frames.current - frames.last;
    console.log({ delta });
    // setFrame(frameTime);
    const newState = {
      ...boidState,
      handleClick: () => {
        console.log("click");
        setBoidState({ ...boidState, color: Konva.Util.getRandomColor() });
      },
    };
    setBoidState(updateBoidState(newState, delta));
  }, [frameTime, frames, boidState]);

  // console.log({ boidState });

  return (
    <>
      <Boid key={boidState.name} boidState={boidState} />
    </>
  );
};
