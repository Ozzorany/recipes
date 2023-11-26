import { useQuery } from "@tanstack/react-query";
import { httpGetAllRecipes } from "../hooks/requests";

export const useAllRecipes = () => {
  return useQuery({
    queryKey: ["useAllRecipes"],
    queryFn: async () => {
      const response = await httpGetAllRecipes();
      return response?.data;
    },
  });
};
