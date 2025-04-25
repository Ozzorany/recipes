import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { SiteRecipe } from "../../models/recipe.model";
import { useGenerateRecipeAssistantMutation } from "../../queries/mutations/useGenerateRecipeAssistantMutation";
import styles from "./GenerateRecipeAssistantDialog.styles";
import RecipeReviewContent from "./RecipeReviewContent";

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
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<SiteRecipe | null>(
    null
  );
  const [userComments, setUserComments] = useState("");

  const handleGenerate = () => {
    if (!input.trim()) return;
    mutate(input, {
      onSuccess: (recipe) => {
        setGeneratedRecipe(recipe);
        setIsReviewMode(true);
      },
      onError: (error) => {
        const message = error?.message;
        setSnackbarMessage(message);
        setOpenSnackBar(true);
      },
    });
  };

  const handleRegenerate = () => {
    if (!generatedRecipe) return;
    const context = userComments
      ? `הנה המתכון הנוכחי: ${JSON.stringify(
          generatedRecipe
        )}\n\nהערות שלי: ${userComments}`
      : `הנה המתכון הנוכחי: ${JSON.stringify(generatedRecipe)}`;

    mutate(context, {
      onSuccess: (recipe) => {
        setGeneratedRecipe(recipe);
        setUserComments("");
      },
      onError: (error) => {
        const message = error?.message;
        setSnackbarMessage(message);
        setOpenSnackBar(true);
      },
    });
  };

  const handleApply = () => {
    if (generatedRecipe) {
      onRecipeGenerated(generatedRecipe);
      handleClose();
    }
  };

  const handleBack = () => {
    setIsReviewMode(false);
    setGeneratedRecipe(null);
    setUserComments("");
  };

  const renderReviewContent = () => {
    if (!generatedRecipe) return null;

    return (
      <RecipeReviewContent
        generatedRecipe={generatedRecipe}
        userComments={userComments}
        setUserComments={setUserComments}
        onRegenerate={handleRegenerate}
        isPending={isPending}
      />
    );
  };

  const handleClose = () => {
    setOpen(false);
    setInput("");
    setShowAlert(true);
    setOpenSnackBar(false);
    setSnackbarMessage("");
    setIsReviewMode(false);
    setGeneratedRecipe(null);
    setUserComments("");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            height: isReviewMode ? "80vh" : "auto",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle sx={styles.title}>
          {isReviewMode ? "בדיקת המתכון" : "סו שף חכם"}
          <IconButton onClick={handleClose} sx={styles.closeBtn}>
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
            flex: 1,
            overflow: "hidden",
            p: 2,
          }}
        >
          {!isReviewMode && showAlert && (
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

          {isReviewMode ? (
            renderReviewContent()
          ) : (
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
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          {isReviewMode ? (
            <>
              <Button
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                size="small"
                sx={{ px: 1 }}
              >
                חזרה
              </Button>
              <Button
                onClick={handleApply}
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                size="small"
                sx={{ px: 1 }}
              >
                שמירת מתכון
              </Button>
            </>
          ) : (
            <LoadingButton
              disabled={!input.trim()}
              onClick={handleGenerate}
              loading={isPending}
              variant="contained"
              startIcon={!isPending && <RestaurantMenuIcon />}
            >
              לעבודה!
            </LoadingButton>
          )}
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
