import type { Boid, StageBoundaries } from "./boidTypes";

export function computeRotation(direction: number, boid?: Boid) {
  // 0 is east, 90 is south, 180 is west, 270 is north
  const rotation = direction - (boid?.wedgeAngle || 40) / 2 + 180;
  return rotation;
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export function cosDeg(direction: number) {
  return Math.cos(degToRad(direction));
}

export function sinDeg(direction: number) {
  return Math.sin(degToRad(direction));
}

export const msPerFrame = 1000 / 60;

export function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}

export function distance2(x1: number, y1: number, x2: number, y2: number) {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}

export function getStageHeight(boundaries: StageBoundaries) {
  return boundaries.y1 - boundaries.y0;
}

export function getStageWidth(boundaries: StageBoundaries) {
  return boundaries.x1 - boundaries.x0;
}

export const computeTorusPositions = (
  boidState: Boid,
  boundaries: StageBoundaries
) => {
  const { x, y, target } = boidState;
  const stageWidth = getStageWidth(boundaries);
  const stageHeight = getStageHeight(boundaries);

  const torusCloneX =
    [x, x + stageWidth, x - stageWidth].find(
      (a) => Math.abs(a - target.x) < stageWidth * 0.5
    ) || 0;
  const torusCloneY =
    [y, y + stageHeight, y - stageHeight].find(
      (a) => Math.abs(a - target.y) < stageHeight * 0.5
    ) || 0;

  const torusTargetX =
    [target.x, target.x + stageWidth, target.x - stageWidth].find(
      (a) => Math.abs(a - x) < stageWidth * 0.5
    ) || 0;
  const torusTargetY =
    [target.y, target.y + stageHeight, target.y - stageHeight].find(
      (a) => Math.abs(a - y) < stageHeight * 0.5
    ) || 0;

  return {
    torusClone: { x: torusCloneX, y: torusCloneY },
    torusTarget: { x: torusTargetX, y: torusTargetY },
  };
};

export const TARGET_COLLISION_DISTANCE = 20;
export const EDGE_PADDING = 50;

export const randomXPos = (boundaries: StageBoundaries) => {
  const stageWidth = getStageWidth(boundaries);
  return Math.random() * (stageWidth - 3 * EDGE_PADDING) + 1.5 * EDGE_PADDING;
};
export const randomYPos = (boundaries: StageBoundaries) => {
  const stageHeight = getStageHeight(boundaries);
  return Math.random() * (stageHeight - 3 * EDGE_PADDING) + 1.5 * EDGE_PADDING;
};

export function getRandomColor() {
  let randColor = ((Math.random() * 0xffffff) << 0).toString(16);
  while (randColor.length < 6) {
    randColor = `0${randColor}`;
  }
  return `#${randColor}`;
}
