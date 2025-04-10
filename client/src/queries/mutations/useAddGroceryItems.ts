import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { httpAddGroceryItem } from "../../hooks/requests";


export const useAddGroceryItems = (
  options?: UseMutationOptions<void, Error, AddGroceryItemsParams>
) => {
  return useMutation({
    mutationFn: ({ listId, items }: AddGroceryItemsParams) =>
      httpAddGroceryItem(listId, items),
    ...options,
  });
}; 