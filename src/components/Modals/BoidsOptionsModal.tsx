import React from "react";
import { Switch } from "@mantine/core";
import DraggableModal from "../DraggableModal";

export function BoidsOptionsModal(props: {
  openOptionsModal: boolean;
  setOpenOptionsModal: React.Dispatch<React.SetStateAction<boolean>>;
  boidsDisplayOptions: string[];
  setBoidsDisplayOptions: React.Dispatch<React.SetStateAction<string[]>>;
  boidsTextOptions: string[];
  setBoidsTextOptions: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <DraggableModal
      open={props.openOptionsModal}
      setOpen={props.setOpenOptionsModal}
      title="Boids Options"
    >
      <Switch.Group
        label="Display Controls"
        value={props.boidsDisplayOptions}
        onChange={props.setBoidsDisplayOptions}
      >
        <Switch
          value="showShortestDistanceLines"
          label="ShortestDistanceLines"
        />
        <Switch value="showTarget" label="Target" />
      </Switch.Group>
      <Switch.Group
        label="Text Controls"
        value={props.boidsTextOptions}
        onChange={props.setBoidsTextOptions}
      >
        <Switch value="showText" label="Text" />
        <Switch value="showAngles" label="Angles" />
        <Switch value="showNames" label="Names" />
        <Switch value="showScores" label="Scores" />
      </Switch.Group>
    </DraggableModal>
  );
}
