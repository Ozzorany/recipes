import { useParams } from "react-router-dom";
import styles from "./RecipePage.module.css";
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
  useTheme,
  Fab,
  Tooltip,
} from "@mui/material";
import noImagePath from "../../assets/images/recipe-book.jpg";
import MicIcon from "@mui/icons-material/Mic";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import {
  CopyIngredientsWrapper,
  IngredientsTitleWrapper,
  TitleWrapper,
  PageCard,
  TagList,
} from "./RecipePage.styles";

import { useEffect, useState } from "react";
import RecipePageEmptyState from "./components/RecipePageEmptyState";
import FloatingChatbot from "../../components/FloatingChatbot/FloatingChatbot";
import { useUserFeatures } from "../../queries/useUserFeatures";
import { USER_FEATURES } from "../../models/user.model";
import VoiceAssistant from "./components/VoiceAssistant/VoiceAssistant";
import GroceryListExtractor from "./components/GroceryListExtractor/GroceryListExtractor";

function RecipePage() {
  const params = useParams();
  const { id } = params || {};
  const { data: recipe, isLoading } = useRecipeById(id!);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const { data: features, isLoading: featuresLoading } = useUserFeatures();
  const theme = useTheme();
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [groceryExtractorOpen, setGroceryExtractorOpen] = useState(false);

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
      <VoiceAssistant
        recipe={recipe}
        open={voiceAssistantOpen}
        onClose={() => setVoiceAssistantOpen(false)}
      />
      <GroceryListExtractor
        open={groceryExtractorOpen}
        onClose={() => setGroceryExtractorOpen(false)}
        recipe={recipe}
      />
      <div className={styles.pageContainer}>
        <PageCard>
          <TitleWrapper>
            <Typography variant="h4" className={styles.title}>
              {recipe?.description}
            </Typography>
          </TitleWrapper>

          <TagList>
            {tags?.map((tag: any) => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.primary.main,
                }}
              />
            ))}
          </TagList>

          <IngredientsTitleWrapper>
            <Typography
              variant="h5"
              className={styles.ingredientsTitle}
              sx={{ color: theme.palette.text.primary }}
            >
              מרכיבים
            </Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="העתק מרכיבים">
                <CopyIngredientsWrapper onClick={copyIngredients}>
                  <IconButton>
                    <ContentCopyIcon
                      sx={{ color: theme.palette.primary.main }}
                    />
                  </IconButton>
                </CopyIngredientsWrapper>
              </Tooltip>
              <Tooltip title="הוסף לרשימת מצרכים">
                <IconButton onClick={() => setGroceryExtractorOpen(true)}>
                  <ShoppingCartIcon
                    sx={{ color: theme.palette.primary.main }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          </IngredientsTitleWrapper>

          <FormGroup className={styles.ingredientsList}>
            {ingredients?.map((ingredient: string, index: number) => (
              <FormControlLabel
                key={index}
                sx={{ color: theme.palette.text.primary }}
                control={
                  <Checkbox sx={{ color: theme.palette.primary.main }} />
                }
                label={ingredient}
                className={styles.ingredientItem}
              />
            ))}
          </FormGroup>

          <Typography
            variant="h6"
            mt={3}
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            אופן הכנה:
          </Typography>
          <Typography className={styles.method}>{method}</Typography>

          <Box
            component="img"
            className={styles.recipeImage}
            alt="The recipe"
            src={image || noImagePath}
          />
        </PageCard>
      </div>

      <Snackbar
        open={openSnackBar}
        onClose={() => setOpenSnackBar(false)}
        autoHideDuration={3000}
        message="הרכיבים הועתקו"
      />

      {!featuresLoading && features?.includes(USER_FEATURES.RECIPE_CHATBOT) && (
        <FloatingChatbot
          recipe={{
            title: recipe?.description,
            ingredients,
            instructions: method,
          }}
        />
      )}

      {!featuresLoading &&
        features?.includes(USER_FEATURES.VOICE_ASSISTANT) && (
          <Fab
            color="primary"
            aria-label="voice-assistant"
            onClick={() => setVoiceAssistantOpen(true)}
            sx={{ position: "fixed", bottom: 25, left: 25, zIndex: 1200 }}
          >
            <MicIcon />
          </Fab>
        )}
    </>
  );
}

export default RecipePage;
