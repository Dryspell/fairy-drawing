import * as React from "react";
import { Stage, Text } from "react-pixi-fiber";
import RotatingBunny from "./RotatingBunny";

const width = 600;
const height = 400;
const options = {
  backgroundColor: 0x56789a,
  resolution: 1,
  width: width,
  height: height
};
const style = {
  width: width,
  height: height
};

function PixiApp() {
  return (
    <Stage options={options} style={style}>
      <Text x={100} y={100} text="Hello world!" />
      <RotatingBunny position="50,50" />
    </Stage>
  );
}

export default PixiApp;
