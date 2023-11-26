import {
  CircularProgress,
  debounce,
  TextField,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useMemo, useState } from "react";
import MultiSelectFilter from "../components/MultiSelectFilter";
import RecipeReviewCard from "../components/RecipeReviewCard/RecipeReviewCard";
import { Recipe } from "../models/recipe.model";
import { useAllRecipes } from "../queries/useAllRecipes";
import styles from "./AllRecipes.module.css"; // Import css modules stylesheet as styles

function AllRecepis() {
  const { data } = useAllRecipes();

  const [value, setValue] = useState("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const matches = useMediaQuery("(min-width:600px)");
  const tags = ["איטלקי", "קינוח", "חלבי", "בשרי"];

  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(changeValue, 100), []);

  const handleFilterTagsChanged = (tags: string[]) => {
    setFilterTags(tags);
  };

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
        </Box>
      </div>

      <Box sx={{ flexGrow: 1, height: "20%", marginTop: "2rem" }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 8, md: 12 }}
        >
          {!data?.length ? (
            <Grid item xs={12} sm={12} md={12} className={styles.spinner}>
              <CircularProgress />
            </Grid>
          ) : (
            data
              .filter(
                (recipe: Recipe) =>
                  recipe.description.includes(value) &&
                  (filterTags.length === 0 ||
                    recipe.tags.some((tag) => filterTags.includes(tag)))
              )
              .map((recipe: Recipe) => {
                return (
                  <Grid item xs={2} sm={4} md={4} key={recipe.id}>
                    <RecipeReviewCard recipe={recipe} />
                  </Grid>
                );
              })
          )}
        </Grid>
      </Box>
    </div>
  );
}

export default AllRecepis;
