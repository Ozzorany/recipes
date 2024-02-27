import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ApprovalDialog({
  open,
  setOpen,
  mainAction,
  title,
  content,
  params,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  mainAction: (groupName: string) => void;
  title?: string;
  content?: string;
  params: any;
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        sx={{ textAlign: "start" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>לא</Button>
          <Button onClick={() => mainAction(params)} autoFocus>
            כן
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
