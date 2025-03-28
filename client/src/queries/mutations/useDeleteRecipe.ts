import { useMutation, UseMutationOptions, useQueryClient  } from "@tanstack/react-query";
import { httpDeleteRecipe } from "../../hooks/requests";
import { QUERY_KEYS } from "../../constants";

export const useDeleteRecipe = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: string) => {
      return httpDeleteRecipe(recipeId);
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_RECIPES] });
    },
  });
};
