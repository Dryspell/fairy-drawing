import React from "react";

export const useFrameTime = () => {
  const [frameTime, setFrameTime] = React.useState(Date.now());
  const [startTime, setStartTime] = React.useState(0);
  const [pause, setPause] = React.useState({ paused: true, pauseTime: 0 });

  const displayTime = pause.paused ? pause.pauseTime : frameTime - startTime;
  const [frames, setFrames] = React.useState({ last: 0, current: 0 });

  setFrames({ last: frames.current, current: displayTime });
  const delta = frames.current - frames.last;

  React.useEffect(() => {
    let frameId: number;
    const frame = (time: number) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const togglePause = () => {
    if (!pause.paused) setPause({ paused: true, pauseTime: displayTime });
    else {
      setStartTime(frameTime - pause.pauseTime);
      setPause({ paused: false, pauseTime: 0 });
    }
  };

  return {
    displayTime,
    frameCount: displayTime / (1000 / 60),
    delta,
    paused: pause.paused,
    togglePause,
  };
};
