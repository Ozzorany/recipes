import { useQuery } from "@tanstack/react-query";
import { httpGetUserById } from "../hooks/requests";

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ["useUserById", userId],
    queryFn: async () => {
      const response = await httpGetUserById(userId);
      return response?.data;
    },
     staleTime: Infinity 
  });
};
