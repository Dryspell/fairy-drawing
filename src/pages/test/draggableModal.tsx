import React from "react";
import DraggableModal from "../../components/DraggableModal";
import Button from "@mui/material/Button";
import { DialogContentText } from "@mui/material";

export default function TestsPage() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(!open)}>
        Open draggable dialog
      </Button>
      <DraggableModal
        open={open}
        setOpen={setOpen}
        title={"Subscribe"}
        actions={
          <>
            <Button autoFocus onClick={() => setOpen(open)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(open)}>Subscribe</Button>
          </>
        }
      >
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
      </DraggableModal>
    </>
  );
}
