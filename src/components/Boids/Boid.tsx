import { Circle, Line, Text, Wedge } from "react-konva";
import { getStageHeight, getStageWidth } from "../../../lib/boidsUtils";
import Konva from "konva";

export const TARGET_COLLISION_DISTANCE = 20;
export const EDGE_PADDING = 50;

export const randomXPos = (boundaries: StageBoundaries) => {
  const stageWidth = getStageWidth(boundaries);
  return Math.random() * (stageWidth - 3 * EDGE_PADDING) + 1.5 * EDGE_PADDING;
};
export const randomYPos = (boundaries: StageBoundaries) => {
  const stageHeight = getStageHeight(boundaries);
  return Math.random() * (stageHeight - 3 * EDGE_PADDING) + 1.5 * EDGE_PADDING;
};

export type StageBoundaries = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

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
