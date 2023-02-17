import React, { useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import type { StageBoundaries } from "../../../lib/boidTypes";
import { Flock } from "./flock";

export type BoidsStageProps = {
  stageBoundaries: StageBoundaries;
  setStageBoundaries: React.Dispatch<React.SetStateAction<StageBoundaries>>;
  flockState: Parameters<typeof Flock>[0]["flockState"];
};

function BoidsStage(props: BoidsStageProps) {
  const [width, setWidth] = useState<number>(
    props.stageBoundaries.x1 - props.stageBoundaries.x0 || window.innerWidth
  );
  const [height, setHeight] = useState<number>(
    props.stageBoundaries.y1 - props.stageBoundaries.y0 || window.innerHeight
  );

  const stageRef = React.useRef<HTMLDivElement>(null);

  const [stageX, setStageX] = useState<number>();
  const [stageY, setStageY] = useState<number>();

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
      props.setStageBoundaries({
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
          <Flock flockState={props.flockState} />
        </Layer>
      </Stage>
    </div>
  );
}

export default BoidsStage;
