import React from "react";
import { Stage, Layer } from "react-konva";
import { Flock } from "./flock";

function BoidsStage() {
  console.log("KonvaCanvas Rendered");

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Flock count={10} />
      </Layer>
    </Stage>
  );
}

export default BoidsStage;
