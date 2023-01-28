import React from "react";
import { useFrameTime } from "../../lib/useFrameTime";

const leftPad = (value: string, length: number) => {
  while (value.length < length) {
    value = "0" + value;
  }
  return value;
};

export const formatTimer = (durationMs: number) => {
  durationMs = Math.floor(durationMs);
  const seconds = Math.floor(durationMs / 1000);
  const ms = Math.floor(durationMs / 10) % 100;
  return `${seconds}:${leftPad(`${ms}`, 2)}`;
};

const Timer = () => {
  const [startTime, setStartTime] = React.useState(0);
  const [pause, setPause] = React.useState({ paused: false, pauseTime: 0 });
  const frameTime = useFrameTime();

  const displayTime = pause.paused ? pause.pauseTime : frameTime - startTime;

  const pauseTime = () => {
    !pause.paused && setPause({ paused: true, pauseTime: displayTime });
  };

  const play = () => {
    pause.paused && setStartTime(frameTime - pause.pauseTime);
    setPause({ paused: false, pauseTime: 0 });
  };

  return (
    <div className="timer">
      <div>{formatTimer(displayTime)}</div>
      <button onClick={pause.paused ? play : pauseTime}>
        {pause.paused ? "Play" : "Pause"}
      </button>
    </div>
  );
};

export default Timer;
