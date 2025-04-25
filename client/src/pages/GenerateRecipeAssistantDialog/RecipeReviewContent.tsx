import { Box, Typography, Paper, TextField } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { SiteRecipe } from "../../models/recipe.model";
import styles from "./RecipeReviewContent.styles";
import LoadingButton from "@mui/lab/LoadingButton";

interface Props {
  generatedRecipe: SiteRecipe;
  userComments: string;
  setUserComments: (comments: string) => void;
  onRegenerate: () => void;
  isPending: boolean;
}

const RecipeReviewContent = ({
  generatedRecipe,
  userComments,
  setUserComments,
  onRegenerate,
  isPending,
}: Props) => {
  return (
    <Box sx={styles.container}>
      <Paper elevation={2} sx={styles.recipePaper}>
        <Typography variant="h6" gutterBottom>
          {generatedRecipe.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {generatedRecipe.method}
        </Typography>
        <Typography variant="h6" gutterBottom>
          מרכיבים:
        </Typography>
        <ul>
          {generatedRecipe.ingredients.map(
            (ingredient: string, index: number) => (
              <li key={index}>
                <Typography variant="body1">{ingredient}</Typography>
              </li>
            )
          )}
        </ul>
      </Paper>

      <Box sx={styles.commentsContainer}>
        <TextField
          fullWidth
          placeholder="בקשות לשינוי במתכון..."
          value={userComments}
          onChange={(e) => setUserComments(e.target.value)}
          size="small"
          sx={styles.commentsInput}
        />
        <LoadingButton
          onClick={onRegenerate}
          loading={isPending}
          disabled={!userComments.trim()}
          variant="contained"
          size="small"
          sx={styles.regenerateButton}
        >
          <AutoAwesomeIcon />
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default RecipeReviewContent;
