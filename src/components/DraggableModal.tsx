import React from "react";
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

  const defaultPosition = {
    x: 500,
    y: 300,
  };
  if (typeof window !== "undefined") {
    defaultPosition.x = window?.innerWidth ? window.innerWidth / 2 : 500;
    defaultPosition.y = window?.innerHeight
      ? window.innerHeight - window.innerHeight / 3
      : 300;
  }

  return (
    <Draggable
      defaultPosition={defaultPosition}
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={nodeRef}
    >
      <div ref={nodeRef}>
        <Popper
          //  ref={nodeRef}
          open={props.open}
          anchorEl={nodeRef?.current || null}
        >
          <Paper className="relative max-w-md">
            <DialogTitleCustom
              onClose={handleClose}
              id="draggable-dialog-title"
            >
              {props.title}
            </DialogTitleCustom>
            <DialogContent>{props.children}</DialogContent>
            {props.actions && <DialogActions>{props.actions}</DialogActions>}
          </Paper>
        </Popper>
      </div>
    </Draggable>
  );
}
