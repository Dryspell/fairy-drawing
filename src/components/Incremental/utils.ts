import type { Item, ItemType, jobs, Recipe} from "./constants";
import { recipes } from "./constants";

export type Work = {
  action: keyof typeof jobs;
  type: ItemType;
};

export type WorkTime = Record<ItemType, { start: number; timeElapsed: number }>;

export const isWorkingThisTask = (work: Work, task: Work) => {
  return work.action === task.action && work.type === task.type;
};

export const canCraft = (recipe: Recipe, inventory: Item[]) => {
  console.log("Checking if can craft", recipe.type, "with", inventory);
  for (const cost of recipe.costs) {
    const item = inventory.find((item) => item.type === cost.type);
    console.log({ item }, cost.amount);
    if ((item?.amount ?? 0) < cost.amount) {
      console.log("Not enough resources");
      return false;
    }
  }
  return true;
};

export const defaultWork = {
  action: "none",
  type: "none",
} as Work;

export const addToInventory = (prevInventory: Item[], recipe: Recipe) => {
  const newInventory = [...prevInventory];
  const existingItemIndex = newInventory.findIndex(
    (item) => item.type === recipe.type
  );
  if (existingItemIndex === -1) {
    console.log(
      `No ${recipe.type} found in inventory, adding ${recipe.amount} ${recipe.type}(s)`
    );
    newInventory.push({
      type: recipe.type,
      amount: recipe.amount,
    });
  } else {
    const updatedItem = { ...newInventory[existingItemIndex]! };
    updatedItem.amount += recipe.amount;
    newInventory[existingItemIndex] = updatedItem;
  }

  console.log(`Added ${recipe.amount} ${recipe.type}(s) to inventory`);
  return newInventory;
};

export const subtractCostsFromInventory = (prevInventory: Item[], recipe: Recipe) => {
  const newInventory = [...prevInventory];
  if (!canCraft(recipe, newInventory)) throw new Error("Not enough resources");
  for (const cost of recipe.costs) {
    const itemToReduceIndex = newInventory.findIndex(
      (item) => item.type === cost.type
    );
    const updatedItem = { ...newInventory[itemToReduceIndex]! };
    updatedItem.amount -= cost.amount;
    newInventory[itemToReduceIndex] = updatedItem;
  }
  return newInventory;
};

export const workProgress = (
  work: Work,
  task: Work,
  workTime: WorkTime,
  displayTime: number
) => {
  const progress =
    timeElapsed(work, task, workTime, displayTime) / recipes[task.type].work;
  return { progress, inProgress: progress > 0 };
};

export const timeElapsed = (
  work: Work,
  task: Work,
  workTime: WorkTime,
  displayTime: number
) =>
  isWorkingThisTask(work, task)
    ? displayTime - workTime[task.type].start + workTime[task.type].timeElapsed
    : workTime[task.type].timeElapsed;

export type InventoryAction =
  | { type: "beginCraft"; recipe: Recipe }
  | {
      type: "finishCraft";
      recipe: Recipe;
    };
