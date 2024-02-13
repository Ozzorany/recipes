import { useQuery } from "@tanstack/react-query";
import { httpGetUserGroups } from "../hooks/requests";

export const useGroups = () => {
  return useQuery({
    queryKey: ["useGroups"],
    queryFn: async () => {
      const response = await httpGetUserGroups();
      return response?.data;
    },
    staleTime: Infinity,
  });
};
