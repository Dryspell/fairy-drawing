import React from "react";
import type { useFrameTime } from "../../../lib/hooks/useFrameTime";
import { LinearProgressWithLabel } from "../../components/Material/LinearProgressWithLabel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { Item } from "./constants";
import { itemsDict } from "./constants";
import { recipes } from "./constants";
import Typography from "@mui/material/Typography";
import type { InventoryAction, Work, WorkTime } from "./utils";
import { isWorkingThisTask, timeElapsed, workProgress } from "./utils";

const showStartStopTime = true;

export const TaskBox = (props: {
  task: Omit<Work, "isWorking">;
  work: Work;
  toggleWork: React.Dispatch<Work>;
  displayTime: ReturnType<typeof useFrameTime>["displayTime"];
  workTime: WorkTime;
  inventory: Item[];
  dispatchInventoryAction: React.Dispatch<InventoryAction>;
}) => {
  const {
    task,
    work,
    toggleWork,
    displayTime,
    workTime,
    inventory,
    dispatchInventoryAction,
  } = props;

  React.useEffect(() => {
    if (
      Math.ceil(
        timeElapsed(work, task, workTime, displayTime) / recipes[task.type].work
      ) >= 100
    ) {
      dispatchInventoryAction({
        type: "finishCraft",
        recipe: recipes[task.type],
      });
    }
  }, [displayTime]);

  return (
    <Box
      sx={{
        border: isWorkingThisTask(work, task)
          ? {
              borderColor: "secondary",
              borderStyle: "solid",
              borderWidth: 1,
            }
          : undefined,
      }}
    >
      <Button
        onClick={() => {
          if (isWorkingThisTask(work, task)) {
            toggleWork(task);
          } else
            dispatchInventoryAction({
              type: "beginCraft",
              recipe: recipes[task.type],
            });
        }}
      >
        {`${
          itemsDict.find((item) => item.type === task.type)?.icon ||
          itemsDict[0].icon
        } ${task.type}: ${
          inventory.find((item) => item.type === task.type)?.amount || 0
        }`}
      </Button>
      {showStartStopTime ? (
        <Box>
          <Typography variant="caption">
            {`DisplayTime: ${displayTime.toFixed(0)} Start: ${workTime[
              task.type
            ].start.toFixed(0)} Elapsed: ${timeElapsed(
              work,
              task,
              workTime,
              displayTime
            ).toFixed(0)}`}
          </Typography>
        </Box>
      ) : null}
      <LinearProgressWithLabel
        value={workProgress(work, task, workTime, displayTime).progress % 100}
      />
    </Box>
  );
};
