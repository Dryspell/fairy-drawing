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
      {(props.gameState.current || []).map((a, index) => {
        const b = { ...a };
        b.x = (2 * b.radius + 5) * parseInt(String(b.x)) + BOARD_PADDING;
        b.y = (2 * b.radius + 5) * parseInt(String(b.y)) + BOARD_PADDING;
        return (
          <AKonva
            key={index}
            aState={b}
            helperOptions={props.helperOptions}
            textOptions={props.textOptions}
          />
        );
      })}
    </>
  );
};
