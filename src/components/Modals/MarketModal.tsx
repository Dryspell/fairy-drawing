import React from "react";
import { Skeleton } from "@mantine/core";
import DraggableModal from "../DraggableModal";

export function MarketModal(props: {
  openMarketModal: boolean;
  setOpenMarketModal: React.Dispatch<React.SetStateAction<boolean>>;
  market: string;
}) {
  return (
    <DraggableModal
      open={props.openMarketModal}
      setOpen={props.setOpenMarketModal}
      title="Market"
    >
      <Skeleton height={"400px"} />
    </DraggableModal>
  );
}
