import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpCreateGroceryList } from "../../hooks/requests";
import { NewSelectedGroceryItem } from "../../models/grocery.model";

type CreateGroceryListPayload = {
  name: string;
  members?: string[];
  items?: NewSelectedGroceryItem[];
};

export const useCreateGroceryListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroceryListPayload) => httpCreateGroceryList(data),
    onSuccess: () => {
      // Invalidate and refetch the user's grocery lists to reflect the new one
      queryClient.invalidateQueries({ queryKey: ["userGroceryLists"] });
    },
  });
};
