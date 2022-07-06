import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import RecipeReviewCard from "../components/RecipeReviewCard";
import useRecipes from "../hooks/useRecipes";
import styles from './AllRecipes.module.css'; // Import css modules stylesheet as styles

function AllRecepis() {
  const recipes = useRecipes();

  return (
    <div className={styles.container}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 8, md: 12 }}>
          {
            recipes.map((recipe) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={recipe.id}>
                  <RecipeReviewCard  recipe={recipe} />
                </Grid>
              )
            })
          }
        </Grid>
      </Box>
    </div>
  );
}

export default AllRecepis;