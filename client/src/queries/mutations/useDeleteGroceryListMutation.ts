import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpDeleteGroceryList } from "../../hooks/requests";

export const useDeleteGroceryListMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (listId: string) => httpDeleteGroceryList(listId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userGroceryLists"] });
      },
    });
  }; 