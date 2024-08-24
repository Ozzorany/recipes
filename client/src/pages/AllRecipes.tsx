import GradeIcon from "@mui/icons-material/Grade";
import {
  debounce,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Lottie from "lottie-react";
import { useEffect, useMemo, useState } from "react";
import FoodAnimation from "../assets/animations/FoodAnimation.json";
import CookingAnimation from "../assets/animations/CookingAnimation.json";
import MultiSelectFilter from "../components/MultiSelectFilter";
import RecipeReviewCard from "../components/RecipeReviewCard/RecipeReviewCard";
import { Recipe } from "../models/recipe.model";
import { useAllRecipes } from "../queries/useAllRecipes";
import { useUserById } from "../queries/useUserById";
import { auth } from "../utils/firebase.utils";
import styles from "./AllRecipes.module.css"; // Import css modules stylesheet as styles

function AllRecepis() {
  const currentAuthUser = auth.currentUser || { uid: "" };
  const { data: recipes, isLoading } = useAllRecipes();
  const [value, setValue] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);
  const matches = useMediaQuery("(min-width:600px)");
  const tags = [
    "איטלקי",
    "קינוח",
    "חלבי",
    "בשרי",
    "מאפים",
    "אסייתי",
    "סלטים",
    "מרקים",
    "דגים",
    "מקסיקני",
    "הודי",
    "ארוחת בוקר",
  ];
  const { data: user } = useUserById(currentAuthUser.uid);
  const userFavoriteRecipes = user?.favoriteRecipes;

  useEffect(() => {
    setFavoriteRecipes(userFavoriteRecipes);
  }, [userFavoriteRecipes]);

  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(changeValue, 100), []);

  const handleFilterTagsChanged = (tags: string[]) => {
    setFilterTags(tags);
  };

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

  const toggleShowFavoritesOnly = () => {
    setShowFavoritesOnly((prevState: boolean) => !prevState);
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

  if (!isLoading && recipes?.length === 0) {
    return (
      <div className={styles.animationWrapper}>
        <div className={styles.noResultsWrapper}>
          <Lottie
            animationData={CookingAnimation}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
          <Typography
            style={{
              color: "white"
            }}
            variant="h5"
          >
            אין לכם מתכונים
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            p: 1,
            m: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ width: `${matches ? "15%" : "100%"}` }}
          >
            <TextField
              id="outlined-multiline-flexible"
              label="חיפוש..."
              onChange={debouncedChangeHandler}
              sx={{ background: "white", width: "100%" }}
            />
          </Box>

          <div
            className="mr-2"
            style={{ width: `${matches ? "15%" : "100%"}` }}
          >
            <MultiSelectFilter
              values={tags}
              valuesChanged={handleFilterTagsChanged}
            />
          </div>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              width: `${matches ? "15%" : "100%"}`,
              alignItems: "center",
              display: "flex",
              marginLeft: "16px",
            }}
          >
            <IconButton
              aria-label="add to favorites"
              onClick={toggleShowFavoritesOnly}
            >
              <GradeIcon
                style={{ color: showFavoritesOnly ? "#f0dd5a" : "gray" }}
                fontSize="large"
              />
            </IconButton>
          </Box>
        </Box>
      </div>

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
                <Grid item xs={2} sm={4} md={4} key={recipe.id}>
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
