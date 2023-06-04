import { Circle, Line, Rect, Text, Wedge } from "react-konva";
import Konva from "konva";
import type {
  Automata,
  HelperOptions,
  TextOptions,
} from "../../../lib/automataTypes";

export const SummaryText = (props: {
  aState: Automata;
  options: TextOptions;
}) => {
  const summary = [
    props.options.showAngles &&
      `direction: ${props.aState.direction.toFixed(0)}`,
    props.options.showAngles &&
      `angleToTarget:${props.aState.angleToTarget.toFixed(0)}`,
    props.options.showNames && `name: ${props.aState.name}`,
    props.options.showScores && `score: ${props.aState.score}`,
  ]
    .filter((t) => t)
    .join("\n");

  return (
    <Text text={summary} x={props.aState.x + 20} y={props.aState.y + 20} />
  );
};

export const HelperLines = (props: { aState: Automata }) => {
  return (
    <>
      <Line
        points={[
          props.aState.x,
          props.aState.y,
          props.aState.torusTarget.x,
          props.aState.torusTarget.y,
        ]}
        stroke={props.aState.color}
        strokeWidth={2}
      />
      <Line
        points={[
          props.aState.torusClone.x,
          props.aState.torusClone.y,
          props.aState.target.x,
          props.aState.target.y,
        ]}
        stroke={props.aState.color}
        strokeWidth={2}
      />
    </>
  );
};

export const ATarget = (props: { x: number; y: number; color: string }) => {
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

export const AKonva = (props: {
  aState: Automata;
  helperOptions: HelperOptions;
  textOptions: TextOptions;
}) => {
  return (
    <>
      {props.textOptions.show && (
        <SummaryText aState={props.aState} options={props.textOptions} />
      )}
      {props.aState.shape === "wedge" ? (
        <Wedge
          x={props.aState.x}
          y={props.aState.y}
          fill={props.aState.color}
          shadowBlur={5}
          radius={40}
          angle={props.aState.wedgeAngle}
          rotation={props.aState.rotation}
          onClick={() => {
            props.aState.handleClick();
            props.aState.color = Konva.Util.getRandomColor();
          }}
        />
      ) : (
        <Rect
          x={props.aState.x}
          y={props.aState.y}
          fill={props.aState.color}
          shadowBlur={5}
          width={40}
          height={40}
          onClick={() => {
            props.aState.handleClick();
            props.aState.color = Konva.Util.getRandomColor();
          }}
        />
      )}
      {props.helperOptions.showTarget && (
        <ATarget
          x={props.aState.target.x}
          y={props.aState.target.y}
          color={props.aState.color}
        />
      )}
      {props.helperOptions.showShortestDistanceLines && (
        <HelperLines aState={props.aState} />
      )}
    </>
  );
};
