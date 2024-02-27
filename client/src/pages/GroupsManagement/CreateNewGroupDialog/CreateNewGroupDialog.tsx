import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

export default function CreateNewGroupDialog({
  open,
  setOpen,
  mainAction,
  isEditMode = false,
  existingGroupName = "",
  existingGroupId = "",
}: {
  open: boolean;
  isEditMode: boolean;
  setOpen: (isOpen: boolean) => void;
  mainAction: (groupName: string) => void;
  existingGroupName?: string;
  existingGroupId?: string;
}) {
  const [text, setText] = React.useState(isEditMode ? existingGroupName : "");

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateGroup = (event: any) => {
    event.preventDefault();
    mainAction(text);
    setOpen(false);
    setText("");
  };

  const handleTextChanged = (event: any) => {
    event.preventDefault();
    setText(event.target.value);
  };

  React.useEffect(() => {
    setText(existingGroupName);
  }, [isEditMode, existingGroupName, existingGroupId]);

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} sx={{ textAlign: "start" }}>
        <DialogTitle>יצירת קבוצה חדשה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode
              ? "שנו את שם הקבוצה"
              : "תנו שם לקבוצה החדשה שתרצו לפתוח. לאחר מכן תוכלו להזמין אנשים להצטרף"}
          </DialogContentText>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="שם קבוצה"
              type="email"
              fullWidth
              variant="standard"
              value={text}
              onChange={handleTextChanged}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button
            type="submit"
            onClick={handleCreateGroup}
            disabled={text.trim().length === 0}
          >
            {isEditMode ? "שמירת שינויים" : "יצירה"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
