import React, { useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useFrameTime } from "../../../lib/hooks/useFrameTime";
import { Flock } from "./flock";

export type BoidsStageProps = {
  width?: number;
  height?: number;
  flock: Omit<Parameters<typeof Flock>[0], "boundaries">;
};

function BoidsStage(props: BoidsStageProps) {
  const [width, setWidth] = useState<number>(props.width || window.innerWidth);
  const [height, setHeight] = useState<number>(
    props.height || window.innerHeight
  );
  const { flock } = props;

  console.log("KonvaCanvas Rendered");

  const stageRef = React.useRef<HTMLDivElement>(null);

  const [stageX, setStageX] = useState<number>();
  const [stageY, setStageY] = useState<number>();
  const [boundaries, setBoundaries] = useState({
    x0: 0,
    x1: width,
    y0: 0,
    y1: height,
  });

  // const frameTime = useFrameTime();
  // const [frames, setFrames] = useState({ last: 0, current: 0 });

  // This function calculate X and Y
  const getPosition = () => {
    if (stageRef.current === null) return;
    const x = stageRef.current.offsetLeft;
    x && setStageX(x);

    const y = stageRef.current.offsetTop;
    setStageY(y);
  };

  const getStageDimensions = () => {
    if (stageRef.current === null) return;
    setWidth(stageRef.current.offsetWidth);
    setHeight(stageRef.current.offsetHeight);
  };

  // Get the position of the red box in the beginning
  useEffect(() => {
    getPosition();
    getStageDimensions();
  }, []);

  // Re-calculate X and Y of the red box when the window is resized by the user
  useEffect(() => {
    window.addEventListener("resize", getPosition);
  }, []);

  useEffect(() => {
    if (stageX && stageY)
      setBoundaries({
        x0: stageX,
        x1: stageX + width,
        y0: stageY,
        y1: stageY + height,
      });
  }, [stageX, stageY, height, width]);

  return (
    <div ref={stageRef}>
      <Stage width={width} height={height}>
        <Layer>
          <Flock {...flock} boundaries={boundaries} />
        </Layer>
      </Stage>
    </div>
  );
}

export default BoidsStage;
