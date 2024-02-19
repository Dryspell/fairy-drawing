import React from "react";
import type { useFrameTime } from "../../../lib/hooks/useFrameTime";
import { LinearProgressWithLabel } from "../../components/Material/LinearProgressWithLabel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { Item, ItemType, jobs, Recipe } from "./constants";
import { itemsDict } from "./constants";
import { recipes } from "./constants";
import Typography from "@mui/material/Typography";
import { LuSword } from "react-icons/lu";

const isWorking = (
  work: { action: keyof typeof jobs; type: ItemType },
  task: { action: keyof typeof jobs; type: ItemType }
) => {
  return work.action === task.action && work.type === task.type;
};

export const canCraft = (recipe: Recipe, inventory: Item[]) => {
  for (const cost of recipe.costs) {
    const index = inventory.findIndex((item) => item.type === cost.type);
    if (index === -1 || (inventory[index]?.amount ?? 0) < cost.amount) {
      console.log("Not enough resources");
      return false;
    }
  }
  return true;
};

export const beginCraft = (
  recipe: Recipe,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>
) => {
  const newInventory = [...inventory];
  for (const cost of recipe.costs) {
    const itemToReduceIndex = newInventory.findIndex(
      (item) => item.type === cost.type
    );
    if (
      itemToReduceIndex === -1 ||
      (newInventory[itemToReduceIndex]?.amount ?? 0) < cost.amount
    ) {
      throw new Error("Not enough resources");
    } else {
      const updatedItem = { ...newInventory[itemToReduceIndex]! };
      updatedItem.amount -= cost.amount;
      newInventory[itemToReduceIndex] = updatedItem;
    }
  }
  setInventory(() => newInventory);
};

export const addToInventory = (
  type: ItemType,
  amount: number,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>
) => {
  const newInventory = [...inventory];
  const existingItemIndex = newInventory.findIndex(
    (item) => item.type === type
  );
  if (existingItemIndex === -1) {
    console.log(`No ${type} found in inventory, adding ${amount} ${type}(s)`);
    setInventory((prevInventory) => [...prevInventory, { type, amount }]);
  } else {
    const updatedItem = { ...newInventory[existingItemIndex]! };
    updatedItem.amount += amount;
    newInventory[existingItemIndex] = updatedItem;
    setInventory(() => [...newInventory]);
  }

  console.log(`Added ${amount} ${type}(s) to inventory`);
  return newInventory;
};

export const finishCraft = (
  recipe: Recipe,
  inventory: Item[],
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>,
  handleToggleWork: () => void
) => {
  const newInventory = addToInventory(
    recipe.type,
    recipe.amount,
    inventory,
    setInventory
  );
  if (canCraft(recipe, newInventory)) {
    beginCraft(recipe, newInventory, setInventory);
  } else {
    handleToggleWork();
  }
};

const showStartStopTime = false;

export const TaskBox = (props: {
  work: { action: keyof typeof jobs; type: ItemType };
  setWork: React.Dispatch<
    React.SetStateAction<{ action: keyof typeof jobs; type: ItemType }>
  >;
  frameTime: ReturnType<typeof useFrameTime>;
  task: { action: keyof typeof jobs; type: ItemType };
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
}) => {
  const [workTime, setWorkTime] = React.useState({
    start: 0,
    timeElapsed: 0,
  });

  const timeElapsed = () =>
    isWorking(props.work, props.task)
      ? props.frameTime.displayTime - workTime.start + workTime.timeElapsed
      : workTime.timeElapsed;

  React.useEffect(() => {
    if (Math.ceil(timeElapsed() / recipes[props.task.type].work) >= 100) {
      finishCraft(
        recipes[props.task.type],
        props.inventory,
        props.setInventory,
        handleToggleWork
      );
      setWorkTime((prev) => ({
        ...prev,
        timeElapsed: prev.timeElapsed - 100 * recipes[props.task.type].work,
      }));
    }
  }, [props.frameTime.displayTime]);

  const handleToggleWork = () => {
    if (isWorking(props.work, props.task)) {
      props.setWork(() => ({
        action: "none",
        type: "none",
      }));
      setWorkTime((prev) => ({
        ...prev,
        stop: props.frameTime.displayTime,
        timeElapsed: timeElapsed(),
      }));
    } else if (
      !canCraft(recipes[props.task.type], props.inventory) &&
      workTime.timeElapsed <= 0
    ) {
      return;
    } else {
      props.setWork(() => props.task);
      setWorkTime((prev) => ({
        ...prev,
        start: props.frameTime.displayTime,
      }));
    }
    props.frameTime.togglePause();
  };

  return (
    <Box>
      <Button onClick={handleToggleWork}>
        {`${
          itemsDict.find((item) => item.type === props.task.type)?.icon ||
          itemsDict[0].icon
        } ${props.task.type}: ${
          props.inventory.find((item) => item.type === props.task.type)
            ?.amount || 0
        }`}
      </Button>
      {showStartStopTime ? (
        <Box>
          <Typography variant="caption">
            {`Start: ${workTime.start} Elapsed: ${timeElapsed()}`}
          </Typography>
        </Box>
      ) : null}
      <LinearProgressWithLabel
        value={Math.ceil(timeElapsed() / recipes[props.task.type].work) % 100}
      />
    </Box>
  );
};
