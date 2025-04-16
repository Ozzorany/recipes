import { useQuery } from "@tanstack/react-query";
import { httpGetRecipesById } from "../hooks/requests";
import { RecipeResponsePayload } from "../models/recipe.model";

export const useRecipeById = (recipeId: string) => {
  return useQuery<RecipeResponsePayload>({
    queryKey: ["useRecipeById", recipeId],
    queryFn: async () => {
      return await httpGetRecipesById(recipeId);
    },
    staleTime: Infinity,
  });
};
