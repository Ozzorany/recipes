import { useMutation, UseMutationOptions, useQueryClient  } from "@tanstack/react-query";
import { httpUpdateRecipe } from "../../hooks/requests";
import { Recipe } from "../../models/recipe.model";
import { QUERY_KEYS } from "../../constants";

export const useUpdateRecipe = (options?: UseMutationOptions<void, Error, Recipe>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: Recipe) => {
      return httpUpdateRecipe(recipe);
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_RECIPES] });
    },
  });
};
