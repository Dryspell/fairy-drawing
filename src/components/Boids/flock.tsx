import React, { useCallback, useEffect } from "react";
import { Boid } from "./Boid";
import type { useFrameTime } from "../../../lib/hooks/useFrameTime";
import { initialBoidState, updateBoidState } from "../../../lib/boidState";

export const Flock = (props: {
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
  boundaries: { x0: number; x1: number; y0: number; y1: number };
  frameTime: ReturnType<typeof useFrameTime>;
}) => {
  const [boids, setBoids] = React.useState<Boid[]>(
    [...Array(props.count).keys()].map((index) =>
      initialBoidState(props.boundaries, props.behavior)
    )
  );

  const [frames, setFrames] = React.useState({
    last: props.frameTime.displayTime,
    current: props.frameTime.displayTime,
  });
  // console.log("frameTime", frameTime, frames);

  useEffect(() => {
    const newFrames = {
      last: frames.current,
      current: props.frameTime.displayTime,
    };
    const delta = newFrames.current - newFrames.last;
    const newBoids = boids.map((boid) => {
      return updateBoidState(boid, delta, props.boundaries);
    });
    setBoids(newBoids);
    setFrames(newFrames);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.frameTime.displayTime]);

  return (
    <>
      {boids.map((boid, index) => (
        <Boid key={index} boidState={boid} />
      ))}
    </>
  );
};
