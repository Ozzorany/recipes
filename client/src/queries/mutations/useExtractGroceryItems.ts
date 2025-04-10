import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { httpExtractGroceryItems } from "../../hooks/requests";
import { Recipe } from "../../models/recipe.model";

export const useExtractGroceryItems = (
  options?: UseMutationOptions<GroceryItem[], Error, Recipe>
) => {
  return useMutation({
    mutationFn: (recipe: Recipe) => httpExtractGroceryItems(recipe),
    ...options,
  });
}; 