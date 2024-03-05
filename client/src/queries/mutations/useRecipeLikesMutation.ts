import { useMutation } from "@tanstack/react-query";
import { httpUpdateRecipeLikes } from "../../hooks/requests";

export const useRecipeLikesMutation = () => {
  return useMutation({
    mutationFn: (recipeId: string) => {
      return httpUpdateRecipeLikes(recipeId);
    },
  });
};
