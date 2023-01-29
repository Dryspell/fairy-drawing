import React, { useEffect } from "react";
import { Stage, Layer, Wedge, Text, Circle, Line } from "react-konva";
import { useFrameTime } from "../../lib/useFrameTime";
import Konva from "konva";
import { faker } from "@faker-js/faker";

type Boid = {
  name: string;
  x: number;
  y: number;
  rotation: number;
  direction: number;
  speed: number;
  acceleration: number;
  wedgeAngle: number;
  color: string;
  target: {
    x: number;
    y: number;
  };
  angleToTarget: number;
  score: number;
};

const EDGE_PADDING = 50;
const TARGET_COLLISION_DISTANCE = 20;

const computeRotation = (direction: number, boid?: Boid) => {
  // 0 is east, 90 is south, 180 is west, 270 is north
  const rotation = (direction % 360) + 180 - (boid?.wedgeAngle || 40) / 2;
  return rotation;
};

const degToRad = (deg: number) => {
  return (deg * Math.PI) / 180;
};
const radToDeg = (rad: number) => {
  return (rad * 180) / Math.PI;
};

const cosDeg = (direction: number) => {
  return Math.cos(degToRad(direction));
};
const sinDeg = (direction: number) => {
  return Math.sin(degToRad(direction));
};
const msPerFrame = 1000 / 60;

const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

const distance2 = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
};

const BoidTarget = (props: { x: number; y: number; color: string }) => {
  return (
    <Circle
      x={props.x}
      y={props.y}
      fill={props.color}
      shadowBlur={5}
      radius={10}
    />
  );
};

const SummaryText = (props: { boidState: Boid }) => {
  const { boidState } = props;

  const summary = [
    // `direction: ${boid.direction.toFixed(0)}`,
    // `angleToTarget:${boid.angleToTarget}`,
    // `cos:${cosDeg(boid.direction).toFixed(2)}`,
    // `sin:${sinDeg(boid.direction).toFixed(2)}`,
    `name: ${boidState.name}`,
    `score: ${boidState.score}`,
  ].join("\n");

  return <Text text={summary} x={boidState.x + 20} y={boidState.y + 20} />;
};

const HelperLines = (props: { boidState: Boid }) => {
  const { boidState } = props;
  return (
    <>
      {/* <Line
        points={[
          boidState.x,
          boidState.y,
          boidState.x + cosDeg(boidState.direction) * 40,
          boidState.y + sinDeg(boidState.direction) * 40,
        ]}
        stroke={boidState.color}
        strokeWidth={2}
      /> */}
      {/* <Line
        points={[
          boidState.x,
          boidState.y,
          boidState.target.x,
          boidState.target.y,
        ]}
        stroke={boidState.color}
        strokeWidth={2}
      /> */}
      <Line
        points={[
          boidState.x,
          boidState.y,
          boidState.x + cosDeg(boidState.angleToTarget) * 40,
          boidState.y + sinDeg(boidState.angleToTarget) * 40,
        ]}
        stroke={boidState.color}
        strokeWidth={2}
      />
    </>
  );
};

const Boid = (props: { frameTime?: number }) => {
  console.log("Boid Rendered");

  const frameTime = useFrameTime();

  const handleClick = () => {
    console.log("click");
    setBoidState({ ...boidState, color: Konva.Util.getRandomColor() });
  };

  const initialDirection = 90; // Math.random() * 360;

  const [boidState, setBoidState] = React.useState<Boid>({
    name: faker.name.firstName(),
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    rotation: computeRotation(initialDirection),
    direction: initialDirection,
    speed: 1,
    acceleration: 0,
    wedgeAngle: 40,
    color: Konva.Util.getRandomColor(),
    target: {
      x:
        Math.random() * (window.innerWidth - 3 * EDGE_PADDING) +
        1.5 * EDGE_PADDING,
      y:
        Math.random() * (window.innerHeight - 3 * EDGE_PADDING) +
        1.5 * EDGE_PADDING,
    },
    angleToTarget: 0,
    score: 0,
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
    const angleToTarget = radToDeg(
      Math.atan2(
        boidState.target.y - boidState.y,
        boidState.target.x - boidState.x
      )
    );

    const direction =
      lerp(boidState.direction, angleToTarget, 0.01 * (delta / msPerFrame)) %
      180;

    const x =
      boidState.x <= window.innerWidth - EDGE_PADDING &&
      boidState.x >= EDGE_PADDING
        ? boidState.x +
          boidState.speed * cosDeg(direction) * (delta / msPerFrame)
        : boidState.x > window.innerWidth - EDGE_PADDING
        ? EDGE_PADDING
        : window.innerWidth - EDGE_PADDING;

    const y =
      boidState.y <= window.innerHeight - EDGE_PADDING &&
      boidState.y >= EDGE_PADDING
        ? boidState.y +
          boidState.speed * sinDeg(direction) * (delta / msPerFrame)
        : boidState.y > window.innerHeight - EDGE_PADDING
        ? EDGE_PADDING
        : window.innerHeight - EDGE_PADDING;

    const target = boidState.target;
    let score = boidState.score;

    if (
      distance2(x, y, boidState.target.x, boidState.target.y) <
      TARGET_COLLISION_DISTANCE ** 2
    ) {
      target.x =
        Math.random() * (window.innerWidth - 3 * EDGE_PADDING) +
        1.5 * EDGE_PADDING;
      target.y =
        Math.random() * (window.innerHeight - 3 * EDGE_PADDING) +
        1.5 * EDGE_PADDING;
      score = score + 1;
    }

    setBoidState({
      ...boidState,
      x,
      y,
      direction,
      rotation: computeRotation(direction),
      angleToTarget,
      target,
      score,
    });
  }, [frameTime]);

  // console.log({ boidState });

  return (
    <>
      <SummaryText boidState={boidState} />
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
      <BoidTarget
        x={boidState.target.x}
        y={boidState.target.y}
        color={boidState.color}
      />
      <HelperLines boidState={boidState} />
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
