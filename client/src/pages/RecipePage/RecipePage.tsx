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
  useTheme,
  Fab,
} from "@mui/material";
import noImagePath from "../../assets/images/recipe-book.jpg";
import MicIcon from "@mui/icons-material/Mic";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  CopyIngredientsWrapper,
  IngredientsTitleWrapper,
  TitleWrapper,
} from "./RecipePage.styles";
import { useEffect, useState } from "react";
import RecipePageEmptyState from "./components/RecipePageEmptyState";
import FloatingChatbot from "../../components/FloatingChatbot/FloatingChatbot";
import { useUserFeatures } from "../../queries/useUserFeatures";
import { USER_FEATURES } from "../../models/user.model";
import VoiceAssistant from "./components/VoiceAssistant/VoiceAssistant";

function RecipePage() {
  const params = useParams();
  const { id } = params || {};
  const { data: recipe, isLoading } = useRecipeById(id!);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const { data: features, isLoading: featuresLoading } = useUserFeatures();
  const theme = useTheme();
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);

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
                  sx={{
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.primary.main,
                  }}
                />
              </Stack>
            );
          })}
        </Box>

        <IngredientsTitleWrapper>
          <Typography
            variant="h5"
            className={styles.ingredientsTitle}
            sx={{ color: theme.palette.text.primary }}
          >
            מרכיבים
          </Typography>
          <CopyIngredientsWrapper onClick={copyIngredients}>
            <IconButton>
              <ContentCopyIcon sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </CopyIngredientsWrapper>
        </IngredientsTitleWrapper>

        <FormGroup>
          {ingredients?.map((ingredient: string) => {
            return (
              <FormControlLabel
                sx={{ color: theme.palette.text.primary }}
                control={
                  <Checkbox sx={{ color: theme.palette.primary.main }} />
                }
                label={ingredient}
                className={styles.checkBox}
              />
            );
          })}
        </FormGroup>
        <Typography
          variant="h5"
          mt={2}
          className={styles.title}
          sx={{ color: theme.palette.text.primary }}
        >
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
      {!featuresLoading && features?.includes(USER_FEATURES.RECIPE_CHATBOT) && (
        <FloatingChatbot
          recipe={{
            title: recipe?.description,
            ingredients,
            instructions: method,
          }}
        />
      )}
      <Fab
        color="primary"
        aria-label="voice-assistant"
        onClick={() => setVoiceAssistantOpen(true)}
        sx={{ position: "fixed", bottom: 25, left: 25, zIndex: 1200 }}
      >
        <MicIcon />
      </Fab>
    </>
  );
}

export default RecipePage;
