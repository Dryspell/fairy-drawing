import { Circle, Line, Text, Wedge } from "react-konva";
import Konva from "konva";
import { Boid } from "../../../lib/boidTypes";

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

export const BoidKonva = (props: { boidState: Boid }) => {
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
