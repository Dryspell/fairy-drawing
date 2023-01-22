import React, { useCallback } from 'react';
import { Graphics } from 'react-pixi-fiber';

export default function Rectangle(props) {
  const draw = useCallback((g) => {
    g.clear();
    g.lineStyle(props.lineWidth, props.color);
    g.drawRect(
      props.lineWidth,
      props.lineWidth,
      props.width - 2 * props.lineWidth,
      props.height - 2 * props.lineWidth
    );
  }, [props]);

  return <Graphics draw={draw} />
}