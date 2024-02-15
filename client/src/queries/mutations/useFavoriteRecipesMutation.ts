import { useMutation } from "@tanstack/react-query";
import { httpUpdateFavoriteRecipes } from "../../hooks/requests";

export const useFavoriteRecipesMutation = () => {
  return useMutation({
    mutationFn: (recipeId: string) => {
      return httpUpdateFavoriteRecipes(recipeId);
    },
  });
};
