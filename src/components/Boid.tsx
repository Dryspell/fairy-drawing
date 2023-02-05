import { Circle, Line, Text, Wedge } from "react-konva";
import {
  computeRotation,
  cosDeg,
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
  torusClone: {
    x: number;
    y: number;
  };
  torusTarget: {
    x: number;
    y: number;
  };
  angleToTarget: number;
  score: number;
  behavior: string;
  handleClick: () => void;
};
const initialDirection = 90; // Math.random() * 360;

export const initialBoidState: (behavior?: string) => Boid = (
  behavior?: string
) => {
  const initialPosition = {
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
    torusClone: {
      x: 0,
      y: 0,
    },
    torusTarget: {
      x: 0,
      y: 0,
    },
    angleToTarget: 0,
    score: 0,
    behavior: behavior || "seekTarget",
    handleClick: () => {
      console.log("click");
    },
  };
  const { torusClone, torusTarget } = computeTorusPositions(
    initialPosition as Boid
  );

  initialPosition.torusClone = torusClone;
  initialPosition.torusTarget = torusTarget;

  return initialPosition;
};

export const SummaryText = (props: { boidState: Boid }) => {
  const { boidState } = props;

  const summary = [
    `direction: ${boidState.direction.toFixed(0)}`,
    `angleToTarget:${boidState.angleToTarget.toFixed(0)}`,
    // `cos:${cosDeg(boidState.direction).toFixed(2)}`,
    // `sin:${sinDeg(boidState.direction).toFixed(2)}`,
    `name: ${boidState.name}`,
    `score: ${boidState.score}`,
  ].join("\n");

  return <Text text={summary} x={boidState.x + 20} y={boidState.y + 20} />;
};

export const HelperLines = (props: { boidState: Boid }) => {
  const { boidState } = props;
  return (
    <>
      <Line
        points={[
          boidState.x,
          boidState.y,
          boidState.torusTarget.x,
          boidState.torusTarget.y,
        ]}
        stroke={boidState.color}
        strokeWidth={2}
      />
      <Line
        points={[
          boidState.torusClone.x,
          boidState.torusClone.y,
          boidState.target.x,
          boidState.target.y,
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

export const computeTorusPositions = (boidState: Boid) => {
  const { x, y, target } = boidState;

  const torusCloneX =
    [x, x + window.innerWidth, x - window.innerWidth].find(
      (a) => Math.abs(a - target.x) < window.innerWidth * 0.5
    ) || 0;
  const torusCloneY =
    [y, y + window.innerHeight, y - window.innerHeight].find(
      (a) => Math.abs(a - target.y) < window.innerHeight * 0.5
    ) || 0;

  const torusTargetX =
    [target.x, target.x + window.innerWidth, target.x - window.innerWidth].find(
      (a) => Math.abs(a - x) < window.innerWidth * 0.5
    ) || 0;
  const torusTargetY =
    [
      target.y,
      target.y + window.innerHeight,
      target.y - window.innerHeight,
    ].find((a) => Math.abs(a - y) < window.innerHeight * 0.5) || 0;

  return {
    torusClone: { x: torusCloneX, y: torusCloneY },
    torusTarget: { x: torusTargetX, y: torusTargetY },
  };
};

export const updateBoidState = (boidState: Boid, delta: number) => {
  const newState = { ...boidState };

  const dX = Math.abs(newState.target.x - newState.x);
  const dY = Math.abs(newState.target.y - newState.y);

  const { torusClone, torusTarget } = computeTorusPositions(newState);
  newState.torusClone = torusClone;
  newState.torusTarget = torusTarget;

  newState.angleToTarget = radToDeg(
    Math.atan2(
      newState.torusTarget.y - newState.y,
      newState.torusTarget.x - newState.x
    )
  );

  if (Math.abs(newState.angleToTarget - newState.direction) > 180)
    newState.angleToTarget =
      [
        newState.angleToTarget,
        newState.angleToTarget + 360,
        newState.angleToTarget - 360,
      ]
        .map((a) => a % 360)
        .find((a) => Math.abs(a - newState.direction) < 180) || 0;

  newState.direction =
    lerp(
      boidState.direction,
      newState.angleToTarget,
      0.04 * (delta / msPerFrame)
      // 0.0005 *
      //   Math.abs(angleToTarget - boidState.direction) *
      //   (delta / msPerFrame)
    ) % 360;

  newState.x =
    newState.x <= window.innerWidth - EDGE_PADDING && newState.x >= EDGE_PADDING
      ? newState.x +
        newState.speed * cosDeg(newState.direction) * (delta / msPerFrame)
      : newState.x > window.innerWidth - EDGE_PADDING
      ? EDGE_PADDING
      : window.innerWidth - EDGE_PADDING;

  newState.y =
    newState.y <= window.innerHeight - EDGE_PADDING &&
    newState.y >= EDGE_PADDING
      ? newState.y +
        newState.speed * sinDeg(newState.direction) * (delta / msPerFrame)
      : newState.y > window.innerHeight - EDGE_PADDING
      ? EDGE_PADDING
      : window.innerHeight - EDGE_PADDING;

  if (dX ** 2 + dY ** 2 < TARGET_COLLISION_DISTANCE ** 2) {
    newState.target.x =
      Math.random() * (window.innerWidth - 3 * EDGE_PADDING) +
      1.5 * EDGE_PADDING;
    newState.target.y =
      Math.random() * (window.innerHeight - 3 * EDGE_PADDING) +
      1.5 * EDGE_PADDING;
    newState.score = newState.score + 1;
  }
  newState.rotation = computeRotation(newState.direction);

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
        onClick={() => {
          boidState.handleClick();
          boidState.color = Konva.Util.getRandomColor();
        }}
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
