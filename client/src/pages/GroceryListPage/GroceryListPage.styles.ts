import { styled } from "@mui/system";
import { Box, Typography, ListItem, ListItemText, Container } from "@mui/material";

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
}));

export const Header = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
}));

export const AddItemSection = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  padding: theme.spacing(2),
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  marginBottom: theme.spacing(1),
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transform: "translateY(-1px)",
  },
}));

export const StyledItemText = styled(ListItemText)(({ theme }) => ({
  textDecoration: "none",
  "& .MuiTypography-root": {
    fontWeight: 500,
  },
}));

export const AmountControls = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const CheckedText = styled("span")(() => ({
  textDecoration: "line-through",
  opacity: 0.6,
}));
