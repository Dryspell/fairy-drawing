import React from "react";
import Head from "next/head";
import { useFrameTime } from "../../../lib/hooks/useFrameTime";
import Timer from "../../components/Stopwatch/Stopwatch";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import type { Item, ItemType } from "../../components/Incremental/constants";
import { itemsDict } from "../../components/Incremental/constants";
import { jobs } from "../../components/Incremental/constants";
import { TaskBox } from "../../components/Incremental/TaskBox";
import type {
  InventoryAction,
  Work,
  WorkTime,
} from "../../components/Incremental/utils";
import {
  addToInventory,
  canCraft,
  defaultWork,
  isWorkingThisTask,
  subtractCostsFromInventory,
  workProgress,
} from "../../components/Incremental/utils";
import { UIContext } from "../../components/Incremental/UILayout";

export default function Game() {
  const { notify } = React.useContext(UIContext);

  const frameTime = useFrameTime();
  const [workTime, setWorkTime] = React.useState<
    Record<ItemType, { start: number; timeElapsed: number }>
  >(
    Object.fromEntries(
      itemsDict.map((item) => [item.type, { start: 0, timeElapsed: 0 }])
    ) as WorkTime
  );

  const [work, toggleWork] = React.useReducer(
    (prevWork: Work, newWork: Work) => {
      if (isWorkingThisTask(prevWork, newWork)) {
        notify({
          message: `Stopping ${prevWork.type}`,
          severity: "info",
        });
        frameTime.togglePause(true);
        setWorkTime((prev) => ({
          ...prev,
          [prevWork.type]: {
            ...prev[prevWork.type],
            start: frameTime.displayTime,
            timeElapsed:
              frameTime.displayTime -
              workTime[prevWork.type].start +
              workTime[prevWork.type].timeElapsed,
          },
        }));
        return defaultWork;
      } else {
        notify({ message: `Starting ${newWork.type}`, severity: "info" });
        setWorkTime((prev) => ({
          ...prev,
          [prevWork.type]: {
            ...prev[prevWork.type],
            start: frameTime.displayTime,
            timeElapsed:
              frameTime.displayTime -
              workTime[prevWork.type].start +
              workTime[prevWork.type].timeElapsed,
          },
          [newWork.type]: {
            ...prev[newWork.type],
            start: frameTime.displayTime,
          },
        }));

        newWork.type === "none"
          ? frameTime.togglePause(true)
          : frameTime.togglePause(false);
        return { ...newWork };
      }
    },
    defaultWork
  );

  const [inventory, dispatchInventoryAction] = React.useReducer(
    (prevInventory: Item[], action: InventoryAction) => {
      switch (action.type) {
        case "beginCraft":
          if (
            workProgress(
              work,
              { action: action.recipe.jobType, type: action.recipe.type },
              workTime,
              frameTime.displayTime
            ).inProgress
          ) {
            notify({
              message: `Resuming progress with ${action.recipe.type}`,
              severity: "info",
            });
            toggleWork({
              action: action.recipe.jobType,
              type: action.recipe.type,
            });
            return [...prevInventory];
          }
          if (!canCraft(action.recipe, prevInventory)) {
            notify({
              message: `Not enough resources to craft ${action.recipe.type}`,
              severity: "error",
            });
            toggleWork(defaultWork);
            frameTime.togglePause(true);
            return [...prevInventory];
          }
          notify({
            message: `Started ${action.recipe.type}`,
            severity: "info",
          });
          toggleWork({
            action: action.recipe.jobType,
            type: action.recipe.type,
          });
          return subtractCostsFromInventory(prevInventory, action.recipe);
        case "finishCraft":
          notify({
            message: `Finished ${action.recipe.type}`,
            severity: "success",
          });
          const newInventory = addToInventory(prevInventory, action.recipe);
          setWorkTime((prev) => ({
            ...prev,
            [action.recipe.type]: {
              start: frameTime.displayTime,
              timeElapsed: 0,
            },
          }));
          if (canCraft(action.recipe, newInventory)) {
            return subtractCostsFromInventory(newInventory, action.recipe);
          } else {
            notify({
              message: `Not enough resources to craft ${action.recipe.type}`,
              severity: "error",
            });
            frameTime.togglePause(true);
            toggleWork(defaultWork);
          }
          return newInventory;
        default:
          return [...prevInventory];
      }
    },
    [] as Item[]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Timer
        frameTime={frameTime}
        // showButton={true}
        showFrameCount={false}
        styles={{ body: undefined, timer: undefined }}
      />
      <Grid container spacing={3}>
        <Grid>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Jobs
              </Typography>
              {Object.entries(jobs).map(([job, value]) => {
                if (!value.production.length) return null;
                return (
                  <Box key={job}>
                    <Typography variant="h6" component="div">
                      {job}
                    </Typography>
                    {value.production.map((production) => {
                      return (
                        <TaskBox
                          key={production}
                          work={work}
                          toggleWork={toggleWork}
                          displayTime={
                            isWorkingThisTask(work, {
                              action: job as keyof typeof jobs,
                              type: production,
                            })
                              ? frameTime.displayTime
                              : workTime[production].start
                          }
                          task={{
                            action: job as keyof typeof jobs,
                            type: production,
                          }}
                          workTime={workTime}
                          inventory={inventory}
                          dispatchInventoryAction={dispatchInventoryAction}
                        />
                      );
                    })}
                  </Box>
                );
              })}
            </CardContent>
            <CardActions>
              {/* <Button size="small">Learn More</Button> */}
            </CardActions>
          </Card>
        </Grid>

        <Grid>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Inventory
              </Typography>
              {inventory.map((item) => {
                return (
                  <Typography key={item.type} variant="h6" component="div">
                    {`${item.type}: ${item.amount}`}
                  </Typography>
                );
              })}
            </CardContent>
            <CardActions>
              {/* <Button size="small">Learn More</Button> */}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
