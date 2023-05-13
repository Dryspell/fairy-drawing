import React from "react";
import { AKonva } from "../Boids/AKonva";
import { type useAutomataState } from "../../../lib/hooks/useAutomataState";
import { BOARD_PADDING } from "./Board";

export const GameStateRenderer = (props: {
  gameState: ReturnType<typeof useAutomataState>;
  helperOptions: Parameters<typeof AKonva>[0]["helperOptions"];
  textOptions: Parameters<typeof AKonva>[0]["textOptions"];
}) => {
  return (
    <>
      {props.gameState.map((a, index) => {
        a.x = (2 * a.radius + 5) * parseInt(String(a.x)) + BOARD_PADDING;
        a.y = (2 * a.radius + 5) * parseInt(String(a.y)) + BOARD_PADDING;
        return (
          <AKonva
            key={index}
            aState={a}
            helperOptions={props.helperOptions}
            textOptions={props.textOptions}
          />
        );
      })}
    </>
  );
};
