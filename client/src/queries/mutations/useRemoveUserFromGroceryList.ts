import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpRemoveUserFromGroceryList } from "../../hooks/requests";

export const useRemoveUserFromGroceryList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, userId }: { listId: string; userId: string }) =>
      httpRemoveUserFromGroceryList(listId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGroceryLists"] });
    },
  });
};
