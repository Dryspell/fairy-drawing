export type ItemType = (typeof itemsDict)[number]["type"];
export type Item = { type: ItemType; amount: number };

export const itemsDict = [
  { type: "none", icon: "🚫" },
  { type: "ore", icon: "⛏️" },
  { type: "ingot", icon: "🪨" },
  { type: "sword", icon: "🗡️" },
  { type: "wood", icon: "🪵" },
] as const;

export type Recipe = {
  type: ItemType;
  jobType: keyof typeof jobs;
  work: number;
  costs: { type: ItemType; amount: number }[];
  amount: number;
};
export const recipes: Record<ItemType, Recipe> = {
  none: {
    type: "none",
    jobType: "none",
    work: 0,
    costs: [],
    amount: 0,
  },
  wood: {
    type: "wood",
    jobType: "woocutting",
    work: 10,
    costs: [],
    amount: 1,
  },
  ore: {
    type: "ore",
    jobType: "mining",
    work: 10,
    costs: [],
    amount: 1,
  },
  ingot: {
    type: "ingot",
    jobType: "smithing",
    work: 60,
    costs: [{ type: "ore", amount: 2 }],
    amount: 1,
  },
  sword: {
    type: "sword",
    jobType: "smithing",
    work: 400,
    costs: [
      { type: "ingot", amount: 3 },
      {
        type: "wood",
        amount: 1,
      },
    ],
    amount: 1,
  },
};

export const jobs = {
  none: {
    production: [],
  },
  woocutting: {
    production: ["wood"],
  },
  mining: {
    production: ["ore"],
  },
  smithing: {
    production: ["ingot", "sword"],
  },
  crafting: {
    production: [],
  },
} as const;
