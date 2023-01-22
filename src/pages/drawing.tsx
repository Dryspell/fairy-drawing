import { Stage, Text } from "react-pixi-fiber";
const width = window.innerWidth * 0.8;
const height = window.innerHeight * 0.8;
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

export default function Drawing () {
  return (
   <Stage options={options} style={style}>
      <Text x={100} y={100} text={JSON.stringify(window.innerWidth)} />
    </Stage>)
}