/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import { Sprite } from "react-pixi-fiber";
import {Point, Texture} from "pixi.js";

const bunny = "https://i.imgur.com/IaUrttj.png";
const centerAnchor = new Point(0.5, 0.5);

function Bunny({ ...props }) {
  return (
    <Sprite
      anchor={centerAnchor}
      texture={Texture.from(bunny)}
      {...props}
    />
  );
}

export default Bunny;
