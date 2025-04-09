import { useMutation } from "@tanstack/react-query";
import { httpJoinGroceryList } from "../../hooks/requests";

export const useJoinGroceryList = () => {
  return useMutation({
    mutationFn: (token: string) => {
      return httpJoinGroceryList(token);
    },
  });
}; 