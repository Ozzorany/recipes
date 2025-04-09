import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCreateGroceryListMutation } from "../../../../queries/mutations/useCreateGroceryListMutation";
import { CreateDialogTitle, DialogWrapper } from "./CreateGroceryList.styles";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CreateGroceryListDialog: React.FC<Props> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const createListMutation = useCreateGroceryListMutation();

  const handleCreate = () => {
    if (!name.trim()) return;

    createListMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          setName("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogWrapper>
        <CreateDialogTitle>
          יצירת רשימת קניות חדשה
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", left: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </CreateDialogTitle>

        <DialogContent
          sx={{ padding: "24px", "& .MuiTextField-root": { marginTop: "8px" } }}
        >
          <TextField
            label="שם הרשימה"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            sx={{
              "& .MuiInputLabel-root": {
                padding: "0 4px",
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={onClose}>ביטול</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={createListMutation.isPending || !name.trim()}
          >
            {createListMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "צור"
            )}
          </Button>
        </DialogActions>
      </DialogWrapper>
    </Dialog>
  );
};

export default CreateGroceryListDialog;
