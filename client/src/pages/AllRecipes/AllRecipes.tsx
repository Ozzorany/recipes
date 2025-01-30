import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import FoodAnimation from "../../assets/animations/FoodAnimation.json";
import RecipeReviewCard from "../../components/RecipeReviewCard/RecipeReviewCard";
import { Recipe } from "../../models/recipe.model";
import { useAllRecipes } from "../../queries/useAllRecipes";
import { useUserById } from "../../queries/useUserById";
import { auth } from "../../utils/firebase.utils";
import styles from "./AllRecipes.module.css";
import AllRecipesEmptyState from "./components/AllRecipesEmptyState/AllRecipesEmptyState";
import AllRecipesFilters from "./components/AllRecipesFilters/AllRecipesFilters";

function AllRecepis() {
  const currentAuthUser = auth.currentUser || { uid: "" };
  const { data: recipes, isLoading } = useAllRecipes();
  const [value, setValue] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);

  const { data: user } = useUserById(currentAuthUser.uid);
  const userFavoriteRecipes = user?.favoriteRecipes;

  useEffect(() => {
    setFavoriteRecipes(userFavoriteRecipes);
  }, [userFavoriteRecipes]);

  const handleFavoriteRecipesChange = (recipeId: string) => {
    const index = favoriteRecipes.indexOf(recipeId);
    if (index !== -1) {
      const newFavoriteIds = [...favoriteRecipes];
      newFavoriteIds.splice(index, 1);
      setFavoriteRecipes(newFavoriteIds);
    } else {
      setFavoriteRecipes([...favoriteRecipes, recipeId]);
    }
  };

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

  if (recipes?.length === 0) {
    return <AllRecipesEmptyState />;
  }

  return (
    <div className={styles.container}>
      <AllRecipesFilters
        filterTags={filterTags}
        setFilterTags={setFilterTags}
        setShowFavoritesOnly={setShowFavoritesOnly}
        setValue={setValue}
        showFavoritesOnly={showFavoritesOnly}
        value={value}
      />
      <Box sx={{ flexGrow: 1, height: "20%", marginTop: "2rem" }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 8, md: 12 }}
        >
          {recipes
            ?.filter(
              (recipe: Recipe) =>
                recipe.description.includes(value) &&
                (filterTags.length === 0 ||
                  recipe.tags.some((tag) => filterTags.includes(tag))) &&
                (!showFavoritesOnly || favoriteRecipes?.includes(recipe.id))
            )
            ?.map((recipe: Recipe) => {
              return (
                <Grid size={{ xs: 2, sm: 4, md: 4 }} key={recipe.id}>
                  <RecipeReviewCard
                    recipe={recipe}
                    isFavorite={favoriteRecipes.includes(recipe.id)}
                    handleFavoriteRecipesChange={handleFavoriteRecipesChange}
                  />
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </div>
  );
}

export default AllRecepis;
