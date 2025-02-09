import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useGenerateRecipeFromSite } from "../../../../queries/mutations/useGenerateRecipeFromSite";
import { TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { SiteRecipe } from "../../../../models/recipe.model";
import LoadingButton from "@mui/lab/LoadingButton";

export default function GenerateRecipeFromSiteDialog({
  open,
  setOpen,
  mainAction,
  title,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  mainAction: (data: SiteRecipe) => void;
  title?: string;
}) {
  const {
    mutate: generateRecipeFromSiteMutation,
    isPending: generateRecipeFromSiteMutationLoading,
  } = useGenerateRecipeFromSite({
    onSuccess: (data) => {
      mainAction(data);
      setOpen(false);
      setError(false);
      setUrlValue("");
    },
    onError: (error) => {
      setError(true);
    },
  });

  const [urlValue, setUrlValue] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        sx={{ textAlign: "start" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              fullWidth
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              id="standard-basic"
              label="קישור למתכון"
              variant="standard"
            />
            {error && (
              <Alert severity="error">
                לא הצלחנו ליצור את המתכון. נסו שוב מאוחר יותר
              </Alert>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={generateRecipeFromSiteMutationLoading}
            type="button"
            onClick={() => generateRecipeFromSiteMutation(urlValue)}
            disabled={!urlValue}
          >
            יצירת מתכון
          </LoadingButton>
          <Button
            onClick={() => {
              setOpen(false);
              setError(false);
              setUrlValue("");
            }}
            color="error"
          >
            ביטול
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
