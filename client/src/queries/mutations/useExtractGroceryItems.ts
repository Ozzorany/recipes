import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { httpExtractGroceryItems } from "../../hooks/requests";
import { RecipeResponsePayload } from "../../models/recipe.model";
import { GroceryItem } from "../../models/grocery.model";

export const useExtractGroceryItems = (
  options?: UseMutationOptions<GroceryItem[], Error, RecipeResponsePayload>
) => {
  return useMutation({
    mutationFn: (recipe: RecipeResponsePayload) =>
      httpExtractGroceryItems(recipe),
    ...options,
  });
};
