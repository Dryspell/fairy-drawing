import React from "react";

export const useFrameTime = () => {
  const [frameTime, setFrameTime] = React.useState(Date.now());
  React.useEffect(() => {
    let frameId: number;
    const frame = (time: number) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
};
