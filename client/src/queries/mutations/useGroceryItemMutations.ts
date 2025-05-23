import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  httpAddGroceryItem,
  httpUpdateGroceryItem,
  httpDeleteGroceryItem,
} from "../../hooks/requests";

export const useAddGroceryItemMutation = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemData: { name: string }) =>
      httpAddGroceryItem(listId, [itemData]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceryList", listId] });
    },
  });
};

export const useUpdateGroceryItemMutation = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: any) => {
      const { id, ...updates } = item;
      return httpUpdateGroceryItem(listId, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceryList", listId] });
    },
  });
};

export const useDeleteGroceryItemMutation = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => httpDeleteGroceryItem(listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceryList", listId] });
    },
  });
};
