export type StageBoundaries = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

export type Boid = {
  name: string;
  x: number;
  y: number;
  rotation: number;
  direction: number;
  speed: number;
  acceleration: number;
  wedgeAngle: number;
  color: string;
  target: {
    x: number;
    y: number;
  };
  torusClone: {
    x: number;
    y: number;
  };
  torusTarget: {
    x: number;
    y: number;
  };
  angleToTarget: number;
  score: number;
  behavior: string;
  handleClick: () => void;
};

export type HelperOptions = {
  showShortestDistanceLines: boolean;
  showTarget: boolean;
};

export type TextOptions = {
  show: boolean;
  showAngles: boolean;
  showNames: boolean;
  showScores: boolean;
};
