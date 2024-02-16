import { useQuery } from "@tanstack/react-query";
import { httpGetUserManagementGroups } from "../hooks/requests";

export const useGroupsManagement = () => {
  return useQuery({
    queryKey: ["useGroupsManagement"],
    queryFn: async () => {
      const response = await httpGetUserManagementGroups();
      return response?.data;
    },
    staleTime: Infinity,
  });
};
