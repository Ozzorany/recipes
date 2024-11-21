import { useParams } from "react-router-dom";
import styles from "./RecipePage.module.css"; // Import css modules stylesheet as styles
import { useRecipeById } from "../../queries/useRecipeById";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Typography,
  Snackbar
} from "@mui/material";
import noImagePath from "../../assets/images/recipe-book.jpg";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyIngredientsWrapper, IngredientsTitleWrapper } from "./RecipePage.styles";
import { useState } from "react";

function RecipePage() {
  const params = useParams();
  const { id } = params || {};
  const { data: response, isLoading } = useRecipeById(id!);
  const { data: recipe, ok } = response || {};
  const { ingredients, method, image, tags } = recipe || {};
  const [openSnackBar, setOpenSnackBar] = useState(false);


  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <CircularProgress />
      </div>
    );
  }

  if (!isLoading && !ok) {
    return <div className={styles.erroMessageWrapper}>
      <Card sx={{ maxWidth: 310, marginTop: "24px" }}>
        <CardContent>
          <ErrorOutlineIcon />
          <Typography
            gutterBottom
            component="div"
            sx={{ fontSize: "18px", fontWeight: 400 }}
          >
            אין אפשרות לצפות במתכון
          </Typography>
          <Typography variant="body2" color="text.secondary">
            יכול להיות שהמתכון שאתם מחפשים נמחק, או שאתם לא נמצאים בקבוצה שבה הוא משותף.
          </Typography>
        </CardContent>
      </Card>
    </div>;
  }

  const copyIngredients = () => {
    setOpenSnackBar(true);
    navigator.clipboard.writeText(ingredients);
  }

  return (
    <>
     <div className={styles.container}>
      <Typography variant="h3" className={styles.title}>
        {recipe?.description}
      </Typography>
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
          <IconButton >
          <ContentCopyIcon sx={{ color: "white" }}/>
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
