import { useParams } from "react-router-dom";
import styles from "./RecipePage.module.css"; // Import css modules stylesheet as styles
import { useRecipeById } from "../../queries/useRecipeById";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Typography,
  Snackbar,
} from "@mui/material";
import noImagePath from "../../assets/images/recipe-book.jpg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  CopyIngredientsWrapper,
  IngredientsTitleWrapper,
  TitleWrapper,
} from "./RecipePage.styles";
import { useEffect, useState } from "react";
import RecipePageEmptyState from "./components/RecipePageEmptyState";

function RecipePage() {
  const params = useParams();
  const { id } = params || {};
  const { data: recipe, isLoading } = useRecipeById(id!);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <CircularProgress />
      </div>
    );
  }

  if (!recipe) {
    return <RecipePageEmptyState />;
  }

  const { ingredients, method, image, tags } = recipe;

  const copyIngredients = () => {
    setOpenSnackBar(true);
    navigator.clipboard
      .writeText(ingredients.join(",\n"))
      .then(() => console.log("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <>
      <div className={styles.container}>
        <TitleWrapper>
          <Typography variant="h4" className={styles.title}>
            {recipe?.description}
          </Typography>
        </TitleWrapper>

        <Box display="flex" justifyContent="start" gap={"8px"}>
          {tags?.map((tag: any) => {
            return (
              <Stack direction="row" key={tag} spacing={1} mt={2}>
                <Chip
                  label={tag}
                  sx={{ color: "white", backgroundColor: "#3d74eb" }}
                />
              </Stack>
            );
          })}
        </Box>

        <IngredientsTitleWrapper>
          <Typography variant="h5" className={styles.ingredientsTitle}>
            מרכיבים
          </Typography>
          <CopyIngredientsWrapper onClick={copyIngredients}>
            <IconButton>
              <ContentCopyIcon sx={{ color: "white" }} />
            </IconButton>
          </CopyIngredientsWrapper>
        </IngredientsTitleWrapper>

        <FormGroup>
          {ingredients?.map((ingredient: string) => {
            return (
              <FormControlLabel
                control={<Checkbox sx={{ color: "white" }} />}
                label={ingredient}
                className={styles.checkBox}
              />
            );
          })}
        </FormGroup>
        <Typography variant="h5" mt={2} className={styles.title}>
          אופן הכנה:
        </Typography>
        <Typography className={styles.method} mt={2}>
          {method}
        </Typography>
        <Box
          mt={2}
          component="img"
          sx={{
            height: 350,
            width: 300,
            objectFit: "contain",
          }}
          alt="The house from the offer."
          src={!!image ? image : noImagePath}
        />
      </div>
      <Snackbar
        open={openSnackBar}
        onClose={() => setOpenSnackBar(false)}
        autoHideDuration={3000}
        message="הרכיבים הועתקו"
      />
    </>
  );
}

export default RecipePage;
