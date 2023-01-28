import Konva from "konva";
import React, { useEffect } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";

function KonvaTest(props: any) {
  console.log("This component Rendered");

  const [color, setColor] = React.useState("green");
  const [pos, setPos] = React.useState({ x: 100, y: 100 });
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
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
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
      </Layer>
    </Stage>
  );
}

export default KonvaTest;
