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

export const PageCard = styled(Box)`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

export const TitleWrapper = styled(Box)`
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled(Typography)({
  fontWeight: 700,
});

export const IngredientsTitleWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const IngredientsTitle = styled(Typography)({
  fontWeight: 600,
});

export const CopyIngredientsWrapper = styled(Box)`
  cursor: pointer;
`;

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

export const TagList = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

export const GroupsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;
