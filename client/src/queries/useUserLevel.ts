import { useQuery } from "@tanstack/react-query";
import { httpGetUserLevel } from "../hooks/requests";

export const useUserLevel = () => {
  return useQuery({
    queryKey: ["useUserLevel"],
    queryFn: async () => {
      const response = await httpGetUserLevel();
      return response?.data;
    },
    staleTime: Infinity,
  });
};
