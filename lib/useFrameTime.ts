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

  const [startTime, setStartTime] = React.useState(0);
  const [pause, setPause] = React.useState({ paused: true, pauseTime: 0 });

  const displayTime = pause.paused ? pause.pauseTime : frameTime - startTime;

  const togglePause = () => {
    if (!pause.paused) setPause({ paused: true, pauseTime: displayTime });
    else {
      setStartTime(frameTime - pause.pauseTime);
      setPause({ paused: false, pauseTime: 0 });
    }
  };

  return { displayTime, paused: pause.paused, togglePause };
};
