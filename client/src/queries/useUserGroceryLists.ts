import { useQuery } from "@tanstack/react-query";
import { httpGetUserGroceryLists } from "../hooks/requests";

export const useUserGroceryLists = () => {
  return useQuery({
    queryKey: ["userGroceryLists"],
    queryFn: async () => {
      return await httpGetUserGroceryLists();
    },
  });
}; 