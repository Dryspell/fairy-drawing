import Konva from "konva";
import React, { useEffect } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";

const MovingRect = (props: any) => {
  console.log("MovingRect Rendered");
  const [pos, setPos] = React.useState({ x: 100, y: 100 });
  const [color, setColor] = React.useState("green");

  const [score, setScore] = React.useState(0);

  const handleClick = () => {
    setColor(Konva.Util.getRandomColor());
    setScore(score + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPos({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Text
        text={`Score: ${score}`}
        x={window.innerWidth / 2}
        y={window.innerHeight / 5}
        draggable
        fontSize={50}
      />
      <Rect
        x={pos.x}
        y={pos.y}
        width={50}
        height={50}
        fill={color}
        shadowBlur={5}
        onClick={handleClick}
      />
    </>
  );
};

function KonvaTest(props: any) {
  console.log("KonvaCanvas Rendered");

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <MovingRect />
      </Layer>
    </Stage>
  );
}

export default KonvaTest;
