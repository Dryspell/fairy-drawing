import { initialBoidState, updateBoidState } from "../boids/boidState";
import React, { useEffect } from "react";
import type { useFrameTime } from "./useFrameTime";
import type { StageBoundaries } from "../automataTypes";

export type cellProps = {
  count: number;
  behavior: string;
  helperOptions?: {
    targetLines: boolean;
    shortestDistanceLines: boolean;
    targetVisible: boolean;
  };
  textOptions?: {
    showText: boolean;
  };
};

export const useAutomataState = (
  cellProps: cellProps,
  frameTime: ReturnType<typeof useFrameTime>,
  boundaries: StageBoundaries
) => {
  const { frameCount, delta } = frameTime;
  const [flockState, setFlockState] = React.useState(
    [...Array(cellProps.count).keys()].map((index) =>
      initialBoidState(index, boundaries, cellProps.behavior)
    )
  );

  useEffect(() => {
    setFlockState(
      flockState.map((boid) => updateBoidState(boid, delta, boundaries))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  return flockState;
};
