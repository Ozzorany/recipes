import { styled } from "@mui/material/styles";
import { Box, Chip, Stack } from "@mui/material";

export const GroupsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

export const GroupChip = styled(Chip)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
}));

export const ExpandedGroupsContainer = styled(Stack)(({ theme }) => ({
  flexWrap: "wrap",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
}));
