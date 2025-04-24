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
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { useGenerateRecipeAssistantMutation } from "../../queries/mutations/useGenerateRecipeAssistantMutation";
import { SiteRecipe } from "../../models/recipe.model";
import styles from "./GenerateRecipeAssistantDialog.styles";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
      setOpen(false);
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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Paper elevation={2} sx={{ p: 2, width: "100%", textAlign: "left" }}>
          <Typography variant="h6" gutterBottom>
            {generatedRecipe.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {generatedRecipe.method}
          </Typography>
          <Typography variant="h6" gutterBottom>
            מרכיבים:
          </Typography>
          <ul>
            {generatedRecipe.ingredients.map(
              (ingredient: string, index: number) => (
                <li key={index}>
                  <Typography variant="body1">{ingredient}</Typography>
                </li>
              )
            )}
          </ul>
        </Paper>

        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="הוסיפו הערות או בקשות לשינוי במתכון..."
          value={userComments}
          onChange={(e) => setUserComments(e.target.value)}
        />
      </Box>
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
              >
                חזרה
              </Button>
              <Box sx={{ display: "flex", gap: 1 }}>
                <LoadingButton
                  onClick={handleRegenerate}
                  loading={isPending}
                  disabled={!userComments.trim()}
                  variant="contained"
                  startIcon={<RefreshIcon />}
                >
                  בואו ננסה שוב
                </LoadingButton>
                <Button
                  onClick={handleApply}
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                >
                  מעולה!
                </Button>
              </Box>
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
