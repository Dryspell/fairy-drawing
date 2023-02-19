import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  IconButton,
  Popper,
} from "@mui/material";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const DialogTitleCustom = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, cursor: "move" }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

//! For virutal element see ref https://popper.js.org/docs/v2/virtual-elements/
function generateGetBoundingClientRect(x = 0, y = 0) {
  return () =>
    ({
      width: x,
      height: y,
      top: y,
      right: x,
      bottom: 0,
      left: 0,
    } as DOMRect);
}

type VirtualElement = {
  getBoundingClientRect: () => DOMRect;
  contextElement?: Element;
};
const virtualElement: VirtualElement = {
  getBoundingClientRect: generateGetBoundingClientRect(1000, 500),
};
//! For virutal element see ref https://popper.js.org/docs/v2/virtual-elements/

export default function DraggableModal(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const nodeRef = React.useRef(null);

  const handleClose = (
    event?: unknown,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    props.setOpen(false);
  };

  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'} nodeRef={nodeRef}>
      <Popper ref={nodeRef} open={props.open} anchorEl={null}>
        <Paper className="relative top-48 -right-96 max-w-md">
          <DialogTitleCustom onClose={handleClose} id="draggable-dialog-title">
            {props.title}
          </DialogTitleCustom>
          <DialogContent>{props.children}</DialogContent>
          {props.actions && <DialogActions>{props.actions}</DialogActions>}
        </Paper>
      </Popper>
    </Draggable>
  );
}
