import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";
import { DialogActions,DialogContent,DialogTitle, Popper, Paper, IconButton } from "@mui/material";

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
    <>
      <Draggable
        handle="#draggable-dialog"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Popper id="draggable-dialog" open={props.open}>
          <Paper className="max-w-md">
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
      </Draggable>
    </>
  );
}
