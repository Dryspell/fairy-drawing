import { Typography } from "@mui/material";
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
  return `${minutes > 0 ? `${minutes}:` : ""}${
    minutes > 0 ? leftPadZero(`${seconds}`, 2) : seconds
  }:${leftPadZero(`${ms}`, 2)}`;
};

const Timer = (props: {
  frameTime: ReturnType<typeof useFrameTime>;
  showFrameCount?: boolean;
  showButton?: boolean;
  styles?: { body: string | undefined; timer: string | undefined };
}) => {
  const showFrameCount = props.showFrameCount ?? false;
  const showButton = props.showButton ?? false;
  const styles = props.styles ?? { body: undefined, timer: undefined };

  return (
    <div className={styles.body}>
      <div className={styles.timer}>
        <Typography variant="h6">
          {formatTimer(props.frameTime.displayTime)}
        </Typography>
        {showFrameCount && (
          <div>
            {props.frameTime.frameCount} - {props.frameTime.delta}
          </div>
        )}
        {showButton && (
          <button onClick={props.frameTime.togglePause}>
            {props.frameTime.paused ? "Play" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
