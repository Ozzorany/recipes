import { useQuery } from "@tanstack/react-query";
import { httpGetAllRecipes } from "../hooks/requests";
import { Recipe } from "../models/recipe.model";

export const useAllRecipes = () => {
  return useQuery<Recipe[]>({
    queryKey: ["useAllRecipes"],
    queryFn: async () => {
      return await httpGetAllRecipes();
    },
    staleTime: Infinity 
  });
};
