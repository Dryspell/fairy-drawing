import Konva from "konva";
import React, { useEffect } from "react";
import { Stage, Layer, Rect, Text, Shape, Wedge } from "react-konva";
import { useFrameTime } from "../../lib/useFrameTime";

type Boid = {
  x: number;
  y: number;
  rotation: number;
  speed: number;
  acceleration: number;
  wedgeAngle: number;
  color: string;
};

const computeDirection = (direction: number, boid?: Boid) => {
  // 0 is north, 90 is east, 180 is south, 270 is west
  const rotation = (direction % 360) + 90 - (boid?.wedgeAngle || 40) / 2;
  return rotation;
};

const Boid = (props: any) => {
  console.log("Boid Rendered");

  // const frameTime = useFrameTime();

  const [boid, setBoid] = React.useState<Boid>({
    x: 100,
    y: 100,
    rotation: computeDirection(90),
    speed: 0,
    acceleration: 0,
    wedgeAngle: 40,
    color: "green",
  });

  const handleClick = () => {
    setBoid({ ...boid, color: Konva.Util.getRandomColor() });
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setPos({
  //       x: Math.random() * window.innerWidth,
  //       y: Math.random() * window.innerHeight,
  //     });
  //   }, 100);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <Wedge
        x={boid.x}
        y={boid.y}
        fill={boid.color}
        shadowBlur={5}
        radius={40}
        angle={boid.wedgeAngle}
        rotationDeg={boid.rotation}
        onClick={handleClick}
      />
    </>
  );
};

function BoidsStage(props: any) {
  console.log("KonvaCanvas Rendered");

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Boid />
      </Layer>
    </Stage>
  );
}

export default BoidsStage;
