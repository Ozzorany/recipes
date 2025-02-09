import { useMutation, UseMutationOptions, useQueryClient  } from "@tanstack/react-query";
import { httpGetRecipeFromSite } from "../../hooks/requests";
import { QUERY_KEYS } from "../../constants";

export const useGenerateRecipeFromSite = (options?: UseMutationOptions<any, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => {
      return httpGetRecipeFromSite(url);
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GENERATE_RECIPE_FROM_SITE] });
    },
    onError: (error,variables, context) => {
      options?.onError?.(error, variables, context);

    }
  });
};
