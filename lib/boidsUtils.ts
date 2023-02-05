import type { Boid } from "../src/components/Boids/Boid";

export const computeRotation = (direction: number, boid?: Boid) => {
  // 0 is east, 90 is south, 180 is west, 270 is north
  const rotation = direction - (boid?.wedgeAngle || 40) / 2 + 180;
  return rotation;
};

export const degToRad = (deg: number) => {
  return (deg * Math.PI) / 180;
};

export const radToDeg = (rad: number) => {
  return (rad * 180) / Math.PI;
};

export const cosDeg = (direction: number) => {
  return Math.cos(degToRad(direction));
};

export const sinDeg = (direction: number) => {
  return Math.sin(degToRad(direction));
};

export const msPerFrame = 1000 / 60;

export const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

export const distance2 = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
};
