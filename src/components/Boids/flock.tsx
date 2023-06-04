import React from "react";
import { AKonva } from "./AKonva";
import type { useBoidFlock } from "../../../lib/hooks/useBoidFlock";

export const Flock = (props: {
  flockState: ReturnType<typeof useBoidFlock>;
  helperOptions: Parameters<typeof AKonva>[0]["helperOptions"];
  textOptions: Parameters<typeof AKonva>[0]["textOptions"];
}) => {
  return (
    <>
      {props.flockState.map((boid, index) => (
        <AKonva
          key={index}
          aState={boid}
          helperOptions={props.helperOptions}
          textOptions={props.textOptions}
        />
      ))}
    </>
  );
};
