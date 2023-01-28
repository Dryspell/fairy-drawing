import React, { useEffect } from "react";
import { Stage, Layer, Wedge, Text } from "react-konva";
import { useFrameTime } from "../../lib/useFrameTime";
import Konva from "konva";

type Boid = {
  x: number;
  y: number;
  rotation: number;
  speed: number;
  acceleration: number;
  wedgeAngle: number;
  color: string;
};

const padding = 50;

const computeRotation = (direction: number, boid?: Boid) => {
  // 0 is east, 90 is north, 180 is west, 270 is south
  const rotation = (-direction % 360) + 180 - (boid?.wedgeAngle || 40) / 2;
  return rotation;
};
const facingX = (direction: number) => {
  return Math.cos((-direction * Math.PI) / 180);
};
const facingY = (direction: number) => {
  return Math.sin((-direction * Math.PI) / 180);
};
const msPerFrame = 1000 / 60;

const Boid = () => {
  console.log("Boid Rendered");

  const frameTime = useFrameTime();

  const handleClick = () => {
    console.log("click");
    setBoidState({ ...boidState, color: Konva.Util.getRandomColor() });
  };

  const initialDirection = 90; // Math.random() * 360;

  const [boidState, setBoidState] = React.useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    rotation: computeRotation(initialDirection),
    direction: initialDirection,
    speed: 1,
    acceleration: 0,
    wedgeAngle: 40,
    color: Konva.Util.getRandomColor(),
  });

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
    const direction =
      (boidState.direction + (Math.random() * 10 - 5) * (delta / msPerFrame)) %
      360;

    const x =
      boidState.x <= window.innerWidth - padding && boidState.x >= padding
        ? boidState.x +
          boidState.speed * facingX(direction) * (delta / msPerFrame)
        : boidState.x > window.innerWidth - padding
        ? padding
        : window.innerWidth - padding;

    const y =
      boidState.y <= window.innerHeight - padding && boidState.y >= padding
        ? boidState.y +
          boidState.speed * facingY(direction) * (delta / msPerFrame)
        : boidState.y > window.innerHeight - padding
        ? padding
        : window.innerHeight - padding;

    setBoidState({
      ...boidState,
      x,
      y,
      direction,
      rotation: computeRotation(direction),
    });
  }, [frameTime]);

  console.log({ boidState });

  return (
    <>
      <Text
        text={`direction: ${boidState.direction.toFixed(0)}\ncos:${facingX(
          boidState.direction
        ).toFixed(2)}\nsin:${facingY(boidState.direction).toFixed(2)}`}
        x={boidState.x + 20}
        y={boidState.y + 20}
      />
      <Wedge
        x={boidState.x}
        y={boidState.y}
        fill={boidState.color}
        shadowBlur={5}
        radius={40}
        angle={boidState.wedgeAngle}
        rotation={boidState.rotation}
        onClick={handleClick}
      />
    </>
  );
};

function BoidsStage() {
  console.log("KonvaCanvas Rendered");

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Boid />
        <Boid />
        <Boid />
        <Boid />
        <Boid />
      </Layer>
    </Stage>
  );
}

export default BoidsStage;
