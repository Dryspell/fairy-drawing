import React from "react";
import DraggableModal from "../DraggableModal";
import ChatBox from "../Chat/ChatBox";

export function ChatModal(props: {
  openChatModal: boolean;
  setOpenChatModal: React.Dispatch<React.SetStateAction<boolean>>;
  chat: string;
}) {
  return (
    <DraggableModal
      open={props.openChatModal}
      setOpen={props.setOpenChatModal}
      title="Chat"
    >
      <ChatBox />
    </DraggableModal>
  );
}
