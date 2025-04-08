import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpCreateGroceryList } from "../../hooks/requests";

type CreateGroceryListPayload = {
  name: string;
  members?: string[];
};

export const useCreateGroceryListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroceryListPayload) =>
      httpCreateGroceryList(data),
    onSuccess: () => {
      // Invalidate and refetch the user's grocery lists to reflect the new one
      queryClient.invalidateQueries({ queryKey: ["userGroceryLists"] });
    },
  });
};
