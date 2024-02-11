import { useQuery } from "@tanstack/react-query";
import { httpGetAllRecipes } from "../hooks/requests";

export const useAllRecipes = (userId: string) => {
  return useQuery({
    queryKey: ["useAllRecipes"],
    queryFn: async () => {
      const response = await httpGetAllRecipes(userId);
      return response?.data;
    },
    staleTime: Infinity 
  });
};
