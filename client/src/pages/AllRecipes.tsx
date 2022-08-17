import { debounce, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useMemo, useState } from "react";
import RecipeReviewCard from "../components/RecipeReviewCard";
import { useAppSelector } from "../hooks/storeHooks";
import { Recipe } from "../models/recipe.model";
import styles from "./AllRecipes.module.css"; // Import css modules stylesheet as styles

function AllRecepis() {
  const { recipes } = useAppSelector((state) => state.recipes);
  const [value, setValue] = useState("");

  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(changeValue, 100), []);

  return (
    <div className={styles.container}>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          display: "flex",
          justifyContent: "start",
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined-multiline-flexible"
            label="חיפוש..."
            onChange={debouncedChangeHandler}
            sx={{ background: "white" }}
          />
        </div>
      </Box>

      <Box sx={{ flexGrow: 1, height: "20%", marginTop: "2rem" }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 8, md: 12 }}
        >
          {recipes
            .filter((recipe: Recipe) => recipe.description.includes(value))
            .map((recipe: Recipe) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={recipe.id}>
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
