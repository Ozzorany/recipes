import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { httpDeleteRecipe, httpGetAllRecipes, httpSubmitRecipe, httpUpdateRecipe } from "../hooks/requests";
import { Recipe } from "../models/recipe.model";
import { RootState } from "./store";

interface RecipesState {
  recipes: Recipe[];
}

const initialState: RecipesState = {
  recipes: [],
};

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async () => {
    const response = await httpGetAllRecipes();
    return response;
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (recipeId: string) => {
    await httpDeleteRecipe(recipeId);
    return recipeId;
  }
);

export const createRecipe = createAsyncThunk(
  "recipes/createRecipe",
  async (recipe: Recipe) => {
    const response: any = await httpSubmitRecipe(recipe);
    return response.data;
  }
);

export const updateRecipe = createAsyncThunk(
  "recipes/updateRecipe",
  async (recipe: Recipe) => {
    const response: any = await httpUpdateRecipe(recipe);
    return response.data;
  }
);

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    removeRecipe: (state, action: PayloadAction<string>) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecipes.fulfilled, (state, action) => {
      state.recipes = action.payload;
    });
    builder.addCase(createRecipe.fulfilled, (state, action) => {
      state.recipes.push(action.payload);
    });
    builder.addCase(updateRecipe.fulfilled, (state, action) => {
      const recipeId: string = action.payload.id;
      const index = state.recipes.findIndex((recipe: Recipe) => recipe.id === recipeId);
      state.recipes[index] = action.payload;
    });
    builder.addCase(deleteRecipe.fulfilled, (state, action) => {
      const recipeId: string = action.payload;
      const index = state.recipes.findIndex(
        (recipe: Recipe) => recipe.id === recipeId
      );

      if (index !== -1) {
        state.recipes.splice(index, 1);
      }
    });
  },
});

export const selectRecipes = (state: RootState) => state.recipes.recipes;

export default recipesSlice.reducer;
