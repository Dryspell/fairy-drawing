import React from "react";
import type { useFrameTime } from "../../../lib/useFrameTime";

const leftPadZero = (value: string, length: number) => {
  while (value.length < length) {
    value = "0" + value;
  }
  return value;
};

export const formatTimer = (durationMs: number) => {
  durationMs = Math.floor(durationMs);
  const minutes = Math.floor(durationMs / (1000 * 60));
  const seconds = Math.floor(durationMs / 1000) % 60;
  const ms = Math.floor(durationMs / 10) % 100;
  return `${minutes > 0 ? `${minutes}:` : ""}${seconds}:${leftPadZero(
    `${ms}`,
    2
  )}`;
};

const Timer = (props: {
  frameTime: ReturnType<typeof useFrameTime>;
  styles: { body: string | undefined; timer: string | undefined };
}) => {
  // const frameTime = props.frameTime;
  // const [startTime, setStartTime] = React.useState(0);
  // const [pause, setPause] = React.useState({ paused: true, pauseTime: 0 });

  // const displayTime = pause.paused ? pause.pauseTime : frameTime - startTime;

  // const togglePause = () => {
  //   if (!pause.paused) setPause({ paused: true, pauseTime: displayTime });
  //   else {
  //     setStartTime(frameTime - pause.pauseTime);
  //     setPause({ paused: false, pauseTime: 0 });
  //   }
  // };

  return (
    <div className={props.styles.body}>
      <div className={props.styles.timer}>
        <div>{formatTimer(props.frameTime.displayTime)}</div>
        <button onClick={props.frameTime.togglePause}>
          {props.frameTime.paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
};

export default Timer;
