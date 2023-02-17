import React from "react";
import type { useFrameTime } from "../../../lib/hooks/useFrameTime";

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
  showFrameCount: boolean;
  styles: { body: string | undefined; timer: string | undefined };
}) => {
  return (
    <div className={props.styles.body}>
      <div className={props.styles.timer}>
        <div>{formatTimer(props.frameTime.displayTime)}</div>
        {props.showFrameCount && (
          <div>
            {props.frameTime.frameCount} - {props.frameTime.delta}
          </div>
        )}
        <button onClick={props.frameTime.togglePause}>
          {props.frameTime.paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
};

export default Timer;
