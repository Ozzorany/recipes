import { useQuery } from "@tanstack/react-query";
import { httpGetAllRecipes } from "../hooks/requests";
import { Recipe } from "../models/recipe.model";
import { QUERY_KEYS } from "../constants";

export const useAllRecipes = () => {
  return useQuery<Recipe[]>({
    queryKey: [QUERY_KEYS.ALL_RECIPES],
    queryFn: async () => {
      return await httpGetAllRecipes();
    },
    staleTime: Infinity 
  });
};
