import React from "react";
import { AKonva } from "../Boids/AKonva";
import { type useAutomataState } from "../../../lib/hooks/useAutomataState";

export const GameStateRenderer = (props: {
  gameState: ReturnType<typeof useAutomataState>;
  helperOptions: Parameters<typeof AKonva>[0]["helperOptions"];
  textOptions: Parameters<typeof AKonva>[0]["textOptions"];
}) => {
  return (
    <>
      {props.gameState.map((cell, index) => (
        <AKonva
          key={index}
          aState={cell}
          helperOptions={props.helperOptions}
          textOptions={props.textOptions}
        />
      ))}
    </>
  );
};
