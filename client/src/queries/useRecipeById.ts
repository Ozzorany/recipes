import { useQuery } from "@tanstack/react-query";
import { httpGetAllRecipes, httpGetRecipesById } from "../hooks/requests";

export const useRecipeById = (recipeId: string) => {
  return useQuery({
    queryKey: ["useRecipeById"],
    queryFn: async () => {
      const response = await httpGetRecipesById(recipeId);
      return response?.data;
    },
  });
};
