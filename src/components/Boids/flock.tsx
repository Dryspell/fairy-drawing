import React, { useCallback, useEffect } from "react";
import { BoidKonva } from "./Boid";
import { FlockProps, useBoidFlock } from "../../../lib/hooks/useBoidFlock";

export const Flock = (props: {
  flockState: ReturnType<typeof useBoidFlock>;
}) => {
  // const [boids, setBoids] = React.useState<Boid[]>(
  //   [...Array(props.count).keys()].map((index) =>
  //     initialBoidState(props.boundaries, props.behavior)
  //   )
  // );

  // const [frames, setFrames] = React.useState({
  //   last: props.frameTime.displayTime,
  //   current: props.frameTime.displayTime,
  // });
  // console.log("frameTime", frameTime, frames);

  // useEffect(() => {
  //   const newFrames = {
  //     last: frames.current,
  //     current: props.frameTime.displayTime,
  //   };
  //   const delta = newFrames.current - newFrames.last;
  //   const newBoids = boids.map((boid) => {
  //     return updateBoidState(boid, delta, props.boundaries);
  //   });
  //   setBoids(newBoids);
  //   setFrames(newFrames);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.frameTime.displayTime]);

  return (
    <>
      {props.flockState.map((boid, index) => (
        <BoidKonva key={index} boidState={boid} />
      ))}
    </>
  );
};
