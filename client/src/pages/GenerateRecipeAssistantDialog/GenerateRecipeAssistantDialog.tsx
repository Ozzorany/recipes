// components/GenerateRecipeAssistantDialog/GenerateRecipeAssistantDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { useGenerateRecipeAssistantMutation } from "../../queries/mutations/useGenerateRecipeAssistantMutation";
import { SiteRecipe } from "../../models/recipe.model";
import styles from "./GenerateRecipeAssistantDialog.styles";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRecipeGenerated: (recipe: SiteRecipe) => void;
}

const GenerateRecipeAssistantDialog = ({
  open,
  setOpen,
  onRecipeGenerated,
}: Props) => {
  const [input, setInput] = useState("");
  const [showAlert, setShowAlert] = useState(true);
  const { mutate, isPending } = useGenerateRecipeAssistantMutation();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleGenerate = () => {
    if (!input.trim()) return;
    mutate(input, {
      onSuccess: (recipe) => {
        onRecipeGenerated(recipe);
        setOpen(false);
      },
      onError: (error) => {
        const message = error?.message;
        setSnackbarMessage(message);
        setOpenSnackBar(true);
      },
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={styles.title}>
          סו שף חכם
          <IconButton onClick={() => setOpen(false)} sx={styles.closeBtn}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            textAlign: "right",
            gap: 2,
          }}
        >
          {showAlert && (
            <Alert
              severity="info"
              onClose={() => setShowAlert(false)}
              sx={{
                direction: "ltr",
                textAlign: "left",
                width: "100%",
                mb: 2,
              }}
            >
              תוכלו להדביק כאן תיאור של מתכון קיים, או לבקש הצעות לארוחה –
              והעוזר יבנה עבורכם את המתכון.
            </Alert>
          )}
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="למשל: תיצור לי מתכון לארוחת ערב חלבית וקלילה"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{
              "& .MuiInputBase-root textarea": {
                maxHeight: { xs: "150px", sm: "200px" },
                overflowY: "hidden",
                transition: "overflow 0.2s ease-in-out",
              },
              "& .MuiInputBase-root:focus-within textarea": {
                overflowY: "auto",
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <LoadingButton
            disabled={!input.trim()}
            onClick={handleGenerate}
            loading={isPending}
            variant="contained"
            startIcon={!isPending && <RestaurantMenuIcon />}
          >
            לעבודה!
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackBar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setOpenSnackBar(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GenerateRecipeAssistantDialog;
