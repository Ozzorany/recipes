import { useParams } from "react-router-dom";
import styles from "./RecipePage.module.css"; // Import css modules stylesheet as styles
import { useRecipeById } from "../../queries/useRecipeById";
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import noImagePath from "../../assets/images/recipe-book.jpg";

function RecipePage() {
  const params = useParams();
  const { id } = params || {};
  const { data: recipe } = useRecipeById(id!);
  const { ingredients, method, image, tags } = recipe || {};

  return (
    <div className={styles.container}>
      <Typography variant="h3" className={styles.title}>
        {recipe?.description}
      </Typography>
      <Box display="flex" justifyContent="start" gap={"8px"}>
      {tags?.map((tag: any) => {
        return (
          <Stack direction="row" key={tag} spacing={1} mt={2}>
            <Chip label={tag} sx={{color: 'white', backgroundColor: '#3d74eb'}}/>
          </Stack>
        );
      })}
      </Box>
     
      <Typography variant="h5" mt={2} className={styles.ingredientsTitle}>
        מרכיבים
      </Typography>
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
  );
}

export default RecipePage;
