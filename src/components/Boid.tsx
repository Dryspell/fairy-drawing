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
import math from "mathjs";

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
    `direction: ${boidState.direction.toFixed(0)}`,
    `angleToTarget:${boidState.angleToTarget}`,
    // `cos:${cosDeg(boidState.direction).toFixed(2)}`,
    // `sin:${sinDeg(boidState.direction).toFixed(2)}`,
    `name: ${boidState.name}`,
    `score: ${boidState.score}`,
  ].join("\n");

  return <Text text={summary} x={boidState.x + 20} y={boidState.y + 20} />;
};

const ShortestDistanceLines = (props: { boidState: Boid }) => {
  const { boidState } = props;
  const wallWidth = window.innerWidth || 1000;
  const wallHeight = window.innerHeight || 1000;

  const corners = [
    [0, 0],
    [wallWidth, 0],
    [wallWidth, wallHeight],
    [0, wallHeight],
  ];

  const walls = [
    [corners[0], corners[1]],
    [corners[1], corners[2]],
    [corners[2], corners[3]],
    [corners[3], corners[0]],
  ];

  const wallPoint = walls
    .map((wall) => {
      if (
        wall === undefined ||
        wall[0] === undefined ||
        wall[1] === undefined ||
        wall[1][0] === undefined ||
        wall[1][1] === undefined ||
        wall[0][0] === undefined ||
        wall[0][1] === undefined
      )
        return { x: boidState.x, y: boidState.y, distance: 0 };

      const A1 = wall[0][1] - wall[1][1];
      const B1 = wall[1][0] - wall[0][0];
      const C1 = A1 * wall[0][0] + B1 * wall[0][1];

      const A2 = -sinDeg(boidState.angleToTarget);
      const B2 = cosDeg(boidState.angleToTarget);
      const C2 = A2 * boidState.x + B2 * boidState.y;

      const det = A1 * B2 - A2 * B1;
      if (det === 0) {
        return { x: boidState.x, y: boidState.y, distance: 0 };
      }
      const x = (B2 * C1 - B1 * C2) / det;
      const y = (A1 * C2 - A2 * C1) / det;

      if (x < 0 || x > wallWidth || y < 0 || y > wallHeight) {
        return { x: boidState.x, y: boidState.y, distance: 0 };
      }

      const distance = distance2(boidState.x, boidState.y, x, y);

      return { x, y, distance };
    })
    .filter((point) => point.distance && point.distance > 0)
    .sort((a, b) => a.distance - b.distance)[0];

  const torusPoint = wallPoint && {
    x: wallHeight - wallPoint.y,
    y: wallWidth - wallPoint.x,
  };

  console.log({ wallPoint, torusPoint });

  return (
    <>
      {wallPoint && (
        <Line
          points={[boidState.x, boidState.y, wallPoint.x, wallPoint.y]}
          stroke={"red"}
          strokeWidth={2}
        />
      )}
      {torusPoint && (
        <Line
          points={[
            boidState.target.x,
            boidState.target.y,
            torusPoint.x,
            torusPoint.y,
          ]}
          stroke={"green"}
          strokeWidth={2}
        />
      )}
      {/* {corners.map((corner, index) => (
        <Line
          key={index}
          points={[boidState.x, boidState.y, corner[0] || 0, corner[1] || 0]}
          stroke={boidState.color}
          strokeWidth={2}
        />
      ))} */}
    </>
  );
};

export const HelperLines = (props: { boidState: Boid }) => {
  const { boidState } = props;
  return (
    <>
      <Line
        points={[
          boidState.x,
          boidState.y,
          boidState.target.x,
          boidState.target.y,
        ]}
        stroke={boidState.color}
        strokeWidth={2}
      />
      {/* <ShortestDistanceLines boidState={boidState} /> */}
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
  const dX = Math.abs(boidState.target.x - boidState.x);
  const dY = Math.abs(boidState.target.y - boidState.y);

  const angleToTarget =
    (radToDeg(
      Math.atan2(
        boidState.target.y - boidState.y,
        boidState.target.x - boidState.x
      )
    ) +
      360) %
    360;

  const direction =
    lerp(boidState.direction, angleToTarget, 0.01 * (delta / msPerFrame)) % 360;

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

  if (dX ** 2 + dY ** 2 < TARGET_COLLISION_DISTANCE ** 2) {
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
