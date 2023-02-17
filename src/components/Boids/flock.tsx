import React from "react";
import { BoidKonva } from "./Boid";
import type { useBoidFlock } from "../../../lib/hooks/useBoidFlock";

export const Flock = (props: {
  flockState: ReturnType<typeof useBoidFlock>;
  helperOptions: Parameters<typeof BoidKonva>[0]["helperOptions"];
  textOptions: Parameters<typeof BoidKonva>[0]["textOptions"];
}) => {
  return (
    <>
      {props.flockState.map((boid, index) => (
        <BoidKonva
          key={index}
          boidState={boid}
          helperOptions={props.helperOptions}
          textOptions={props.textOptions}
        />
      ))}
    </>
  );
};
