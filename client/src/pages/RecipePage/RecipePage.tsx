import { useParams } from "react-router-dom";
import styles from "./RecipePage.module.css"; // Import css modules stylesheet as styles
import { useRecipeById } from "../../queries/useRecipeById";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import noImagePath from "../../assets/images/recipe-book.jpg";


function RecipePage() {
  const params = useParams();
  const { id } = params || {};
  const { data: recipe } = useRecipeById(id!);
  const { ingredients, method, image } = recipe || {};

  return (
    <div className={styles.container}>
      <Typography variant="h3" className={styles.title}>
        {recipe?.description}
      </Typography>
      <Typography variant="h5" className={styles.title}>
        מרכיבים
      </Typography>
      <FormGroup>
        {ingredients?.map((ingredient: string) => {
          return (
            <FormControlLabel
              control={<Checkbox />}
              label={ingredient}
              className={styles.checkBox}
            />
          );
        })}
      </FormGroup>
      <Typography variant="h5" className={styles.title}>
        אופן הכנה:
      </Typography>
      <Typography className={styles.method}>{method}</Typography>
      <Box
        component="img"
        sx={{
          height: 350,
          width: 'auto',
        }}
        alt="The house from the offer."
        src={!!image ? image : noImagePath}
      />
    </div>
  );
}

export default RecipePage;
