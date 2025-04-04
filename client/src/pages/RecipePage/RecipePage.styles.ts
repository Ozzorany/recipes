import { styled } from "@mui/system";
import { Typography, Box } from "@mui/material";

export const PageContainer = styled("div")(({ theme }) => ({
  padding: "32px 16px",
  display: "flex",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
}));

export const Spinner = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "70vh",
});

export const PageCard = styled("div")(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  maxWidth: "800px",
  margin: "0 auto",
  width: "100%",
}));

export const TitleWrapper = styled("div")({
  display: "flex",
  justifyContent: "start",
  gap: "8px",
  alignItems: "center",
});

export const Title = styled(Typography)({
  fontWeight: 700,
});

export const IngredientsTitleWrapper = styled("div")({
  display: "flex",
  justifyContent: "start",
  gap: "8px",
  alignItems: "center",
  marginTop: "24px",
});

export const IngredientsTitle = styled(Typography)({
  fontWeight: 600,
});

export const CopyIngredientsWrapper = styled("div")({
  cursor: "pointer",
});

export const IngredientsList = styled("div")({
  marginTop: "12px",
});

export const IngredientItem = styled("div")(({ theme }) => ({
  marginBottom: "8px",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderRadius: "8px",
    paddingLeft: "8px",
  },
}));

export const Method = styled(Typography)({
  marginTop: "12px",
  lineHeight: 1.7,
  whiteSpace: "pre-line",
});

export const RecipeImage = styled(Box)({
  width: "100%",
  maxWidth: "400px",
  height: "auto",
  marginTop: "24px",
  borderRadius: "12px",
  objectFit: "cover",
});

export const TagList = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "16px",
});
