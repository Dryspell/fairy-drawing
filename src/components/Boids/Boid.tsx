import { Circle, Line, Text, Wedge } from "react-konva";
import Konva from "konva";
import type { Boid, HelperOptions, TextOptions } from "../../../lib/boidTypes";

export const SummaryText = (props: {
  boidState: Boid;
  options: TextOptions;
}) => {
  const { boidState } = props;

  const summary = [
    props.options.showAngles && `direction: ${boidState.direction.toFixed(0)}`,
    props.options.showAngles &&
      `angleToTarget:${boidState.angleToTarget.toFixed(0)}`,
    props.options.showNames && `name: ${boidState.name}`,
    props.options.showScores && `score: ${boidState.score}`,
  ]
    .filter((t) => t)
    .join("\n");

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

export const BoidKonva = (props: {
  boidState: Boid;
  helperOptions: HelperOptions;
  textOptions: TextOptions;
}) => {
  const { boidState } = props;
  return (
    <>
      {props.textOptions.show && (
        <SummaryText boidState={boidState} options={props.textOptions} />
      )}
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
      {props.helperOptions.showTarget && (
        <BoidTarget
          x={boidState.target.x}
          y={boidState.target.y}
          color={boidState.color}
        />
      )}
      {props.helperOptions.showShortestDistanceLines && (
        <HelperLines boidState={boidState} />
      )}
    </>
  );
};
