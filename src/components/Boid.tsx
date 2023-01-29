import { Circle, Line, Text, Wedge } from "react-konva";
import {
  computeRotation,
  cosDeg,
  distance2,
  lerp,
  msPerFrame,
  radToDeg,
  sinDeg,
} from "../../lib/utils";
import { faker } from "@faker-js/faker";
import Konva from "konva";

export const TARGET_COLLISION_DISTANCE = 20;
export const EDGE_PADDING = 50;

export const randomXPos = () =>
  Math.random() * (window.innerWidth - 3 * EDGE_PADDING) + 1.5 * EDGE_PADDING;
export const randomYPos = () =>
  Math.random() * (window.innerHeight - 3 * EDGE_PADDING) + 1.5 * EDGE_PADDING;

export type Boid = {
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
  handleClick: () => void;
};
const initialDirection = 90; // Math.random() * 360;

export const initialBoidState: () => Boid = () => {
  return {
    name: faker.name.firstName(),
    x: randomXPos(),
    y: randomYPos(),
    rotation: computeRotation(initialDirection),
    direction: initialDirection,
    speed: 1,
    acceleration: 0,
    wedgeAngle: 40,
    color: Konva.Util.getRandomColor(),
    target: {
      x: randomXPos(),
      y: randomYPos(),
    },
    angleToTarget: 0,
    score: 0,
    handleClick: () => {
      console.log("click");
    },
  };
};

export const SummaryText = (props: { boidState: Boid }) => {
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

export const HelperLines = (props: { boidState: Boid }) => {
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

export const BoidTarget = (props: { x: number; y: number; color: string }) => {
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

export const updateBoidState = (boidState: Boid, delta: number) => {
  const angleToTarget = radToDeg(
    Math.atan2(
      boidState.target.y - boidState.y,
      boidState.target.x - boidState.x
    )
  );

  const direction =
    lerp(boidState.direction, angleToTarget, 0.01 * (delta / msPerFrame)) % 180;

  const x =
    boidState.x <= window.innerWidth - EDGE_PADDING &&
    boidState.x >= EDGE_PADDING
      ? boidState.x + boidState.speed * cosDeg(direction) * (delta / msPerFrame)
      : boidState.x > window.innerWidth - EDGE_PADDING
      ? EDGE_PADDING
      : window.innerWidth - EDGE_PADDING;

  const y =
    boidState.y <= window.innerHeight - EDGE_PADDING &&
    boidState.y >= EDGE_PADDING
      ? boidState.y + boidState.speed * sinDeg(direction) * (delta / msPerFrame)
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

  const newState = {
    ...boidState,
    x,
    y,
    direction,
    rotation: computeRotation(direction),
    angleToTarget,
    target,
    score,
  };
  return newState;
};

export const Boid = (props: { boidState: Boid }) => {
  const { boidState } = props;
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
        onClick={boidState.handleClick}
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
