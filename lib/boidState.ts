import {
  computeRotation,
  computeTorusPositions,
  cosDeg,
  EDGE_PADDING,
  getRandomColor,
  getStageHeight,
  getStageWidth,
  lerp,
  msPerFrame,
  radToDeg,
  randomXPos,
  randomYPos,
  sinDeg,
  TARGET_COLLISION_DISTANCE,
} from "./boidsUtils";
import { faker } from "@faker-js/faker";
import type { Boid, StageBoundaries } from "./boidTypes";

export const initialBoidState = (
  id: string | number,
  boundaries: StageBoundaries,
  behavior?: string
) => {
  const initialDirection = Math.random() * 360;

  const initialPosition = {
    id,
    name: faker.name.firstName(),
    x: randomXPos(boundaries),
    y: randomYPos(boundaries),
    rotation: computeRotation(initialDirection),
    direction: initialDirection,
    speed: 1,
    acceleration: 0,
    wedgeAngle: 40,
    color: getRandomColor(),
    target: {
      x: randomXPos(boundaries),
      y: randomYPos(boundaries),
    },
    torusClone: {
      x: 0,
      y: 0,
    },
    torusTarget: {
      x: 0,
      y: 0,
    },
    angleToTarget: 0,
    score: 0,
    behavior: behavior || "seekTarget",
    handleClick: () => {
      console.log("click");
    },
  };

  const { torusClone, torusTarget } = computeTorusPositions(
    initialPosition as Boid,
    boundaries
  );

  initialPosition.torusClone = torusClone;
  initialPosition.torusTarget = torusTarget;

  return initialPosition as Boid;
};

export function updateBoidState(
  boidState: Boid,
  delta: number,
  boundaries: { x0: number; x1: number; y0: number; y1: number }
) {
  const newState = { ...boidState };

  const dX = Math.abs(newState.target.x - newState.x);
  const dY = Math.abs(newState.target.y - newState.y);

  const { torusClone, torusTarget } = computeTorusPositions(
    newState,
    boundaries
  );

  const stageWidth = getStageWidth(boundaries);
  const stageHeight = getStageHeight(boundaries);

  newState.torusClone = torusClone;
  newState.torusTarget = torusTarget;

  newState.angleToTarget = radToDeg(
    Math.atan2(
      newState.torusTarget.y - newState.y,
      newState.torusTarget.x - newState.x
    )
  );

  if (Math.abs(newState.angleToTarget - newState.direction) > 180)
    newState.angleToTarget =
      [
        newState.angleToTarget,
        newState.angleToTarget + 360,
        newState.angleToTarget - 360,
      ]
        .map((a) => a % 360)
        .find((a) => Math.abs(a - newState.direction) < 180) || 0;

  newState.direction =
    lerp(
      boidState.direction,
      newState.angleToTarget,
      0.04 * (delta / msPerFrame)
      // 0.0005 *
      //   Math.abs(angleToTarget - boidState.direction) *
      //   (delta / msPerFrame)
    ) % 360;

  newState.x =
    newState.x <= stageWidth && newState.x >= 0
      ? newState.x +
        newState.speed * cosDeg(newState.direction) * (delta / msPerFrame)
      : newState.x > stageWidth
      ? 0
      : stageWidth;

  newState.y =
    newState.y <= stageHeight && newState.y >= 0
      ? newState.y +
        newState.speed * sinDeg(newState.direction) * (delta / msPerFrame)
      : newState.y > stageHeight
      ? 0
      : stageHeight;

  if (dX ** 2 + dY ** 2 < TARGET_COLLISION_DISTANCE ** 2) {
    newState.target.x =
      Math.random() * (stageWidth - 3 * EDGE_PADDING) + 1.5 * EDGE_PADDING;
    newState.target.y =
      Math.random() * (stageHeight - 3 * EDGE_PADDING) + 1.5 * EDGE_PADDING;
    newState.score = newState.score + 1;
  }
  newState.rotation = computeRotation(newState.direction);

  return newState;
}
