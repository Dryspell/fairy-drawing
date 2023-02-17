import { initialBoidState, updateBoidState } from "../boidState";
import React, { useEffect } from "react";
import type { useFrameTime } from "./useFrameTime";

export const useBoidFlock = (frameTime: ReturnType<typeof useFrameTime>) => {
  const { frameCount, delta } = frameTime;
  const [boidState, setBoidState] = React.useState(
    initialBoidState({ x0: 0, x1: 100, y0: 0, y1: 100 })
  );

  useEffect(() => {
    setBoidState(
      updateBoidState(boidState, delta, { x0: 0, x1: 100, y0: 0, y1: 100 })
    );
  }, [frameCount]);
};
