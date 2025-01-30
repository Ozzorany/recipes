import { useMutation, UseMutationOptions, useQueryClient  } from "@tanstack/react-query";
import { httpSubmitRecipe } from "../../hooks/requests";
import { Recipe } from "../../models/recipe.model";
import { QUERY_KEYS } from "../../constants";

export const useCreateRecipe = (options?: UseMutationOptions<string, Error, Recipe>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: Recipe) => {
      return httpSubmitRecipe(recipe);
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_RECIPES] });
    },
  });
};
