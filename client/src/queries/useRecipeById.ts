import { useQuery } from "@tanstack/react-query";
import { httpGetRecipesById } from "../hooks/requests";

export const useRecipeById = (recipeId: string) => {
  return useQuery({
    queryKey: ["useRecipeById", recipeId],
    queryFn: async () => {
      const response = await httpGetRecipesById(recipeId);
      return response?.data;
    },
    staleTime: Infinity,
  });
};
