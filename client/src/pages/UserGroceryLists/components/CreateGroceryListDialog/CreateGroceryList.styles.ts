import { styled } from "@mui/system";
import { DialogTitle, Box } from "@mui/material";

export const DialogWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

export const CreateDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  padding: "24px 24px 0 24px",
  position: "relative",
}));
