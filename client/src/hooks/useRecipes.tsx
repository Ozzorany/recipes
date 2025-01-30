import { useCallback, useState } from "react";
import { Recipe } from "../models/recipe.model";
import { httpDeleteRecipe } from "./requests";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const deleteRecipe = useCallback(async (id: string) => {
    await httpDeleteRecipe(id);
  }, []);

  return {
    recipes,
    deleteRecipe,
  };
};

export default useRecipes;
