import React, { useEffect } from "react";
import { Boid, initialBoidState, updateBoidState } from "./Boid";
import { useFrameTime } from "../../lib/useFrameTime";

export const Flock = (props: {
  count: number;
  delta: number;
  behavior: string;
  helperOptions?: {
    targetLines: boolean;
    shortestDistanceLines: boolean;
    targetVisible: boolean;
  };
  textOptions?: {
    showText: boolean;
  };
}) => {
  const [boids, setBoids] = React.useState<Boid[]>(
    [...Array(props.count).keys()].map((index) =>
      initialBoidState(props.behavior)
    )
  );

  const frameTime = useFrameTime();

  const [frames, setFrames] = React.useState({
    last: frameTime,
    current: frameTime,
  });
  // console.log("frameTime", frameTime, frames);

  useEffect(() => {
    setFrames({ last: frames.current, current: frameTime });
  }, [frameTime]);

  useEffect(() => {
    const delta = frames.current - frames.last;
    // console.log({ delta });
    const newBoids = boids.map((boid) => {
      return updateBoidState(boid, delta);
    });
    setBoids(newBoids);
  }, [frames]);

  return (
    <>
      {boids.map((boid, index) => (
        <Boid key={index} boidState={boid} />
      ))}
    </>
  );
};
