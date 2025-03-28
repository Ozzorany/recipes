import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Lottie from "lottie-react";
import { useState } from "react";
import FoodAnimation from "../../assets/animations/FoodAnimation.json";
import RecipeReviewCard from "../../components/RecipeReviewCard/RecipeReviewCard";
import { Recipe } from "../../models/recipe.model";
import { useAllRecipes } from "../../queries/useAllRecipes";
import styles from "./AllRecipes.module.css";
import AllRecipesEmptyState from "./components/AllRecipesEmptyState/AllRecipesEmptyState";
import AllRecipesFilters from "./components/AllRecipesFilters/AllRecipesFilters";
import { sortRecipes } from "./AllRecipes.helper";

function AllRecepis() {
  const { data: recipes, isLoading } = useAllRecipes();
  const [value, setValue] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string[]>([]);

  if (isLoading) {
    return (
      <div style={{ width: "50%", height: "100vh", maxWidth: 300 }}>
        <Lottie
          animationData={FoodAnimation}
          loop={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  if (!recipes || recipes?.length === 0) {
    return <AllRecipesEmptyState />;
  }

  return (
    <div className={styles.container}>
      <AllRecipesFilters
        filterTags={filterTags}
        setFilterTags={setFilterTags}
        setValue={setValue}
        value={value}
      />
      <Box sx={{ flexGrow: 1, height: "20%", marginTop: "2rem" }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 8, md: 12 }}
        >
          {sortRecipes(recipes)
            ?.filter(
              (recipe: Recipe) =>
                recipe.description.includes(value) &&
                (filterTags.length === 0 ||
                  recipe.tags.some((tag) => filterTags.includes(tag)))
            )
            ?.map((recipe: Recipe) => {
              return (
                <Grid size={{ xs: 2, sm: 4, md: 4 }} key={recipe.id}>
                  <RecipeReviewCard recipe={recipe} />
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </div>
  );
}

export default AllRecepis;
