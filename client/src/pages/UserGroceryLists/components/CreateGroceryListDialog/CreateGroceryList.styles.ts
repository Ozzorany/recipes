import { styled } from "@mui/system";
import { DialogTitle, Box } from "@mui/material";

export const DialogWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

export const CreateDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  display: "flex",
  justifyContent: "center"
}));
